import React, { useState } from 'react';
import Card from '../../components/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { generateQuiz, getPerformanceAnalysis } from '../../services/geminiService';
import type { QuizQuestion, QuizResult } from '../../types';

const QuizScreen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useLocalStorage<QuizResult[]>('quizResults', []);
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);

  const handleStartQuiz = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setQuiz(null);
    setFinalResult(null);
    try {
      const questions = await generateQuiz(topic.trim());
      if (questions && questions.length > 0) {
        setQuiz(questions);
        setCurrentQuestionIndex(0);
        setUserAnswers([]);
      } else {
        setError('Failed to generate quiz. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while generating the quiz.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);

    setTimeout(async () => {
        if (currentQuestionIndex < (quiz?.length ?? 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Quiz finished
            const score = quiz!.reduce((acc, question, index) => {
                return acc + (question.correctAnswer === newAnswers[index] ? 1 : 0);
            }, 0);
            
            setIsLoading(true); // Show loading for AI analysis
            const suggestion = await getPerformanceAnalysis(topic, score, quiz!.length);
            setIsLoading(false);

            const newResult: QuizResult = {
                date: Date.now(),
                score,
                totalQuestions: quiz!.length,
                topic: topic,
                aiSuggestion: suggestion,
            };
            setQuizResults([...quizResults, newResult]);
            setFinalResult(newResult);
        }
    }, 500); // Short delay to show feedback
  };
  
  const resetQuiz = () => {
      setQuiz(null);
      setTopic('');
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
      setFinalResult(null);
  };
  
  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary dark:border-dark-primary"></div>
            <h2 className="text-xl font-medium">{finalResult ? 'Analyzing performance...' : 'Generating your quiz...'}</h2>
            <p className="text-on-surface-variant dark:text-dark-on-surface-variant">The AI is thinking. This might take a moment.</p>
        </div>
    );
  }
  
  if (finalResult) {
    return (
      <Card>
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant mb-6">You scored</p>
            <p className="text-6xl font-bold text-primary dark:text-dark-primary mb-6">{finalResult.score} <span className="text-3xl text-on-surface-variant">/ {finalResult.totalQuestions}</span></p>
            
            <div className="my-6 p-4 bg-primary-container/50 dark:bg-dark-primary-container/50 border border-primary-container dark:border-dark-primary-container rounded-2xl">
                <h3 className="font-semibold text-on-primary-container dark:text-dark-on-primary-container mb-2">🤖 AI Suggestion</h3>
                <p className="text-sm text-on-primary-container/80 dark:text-dark-on-primary-container/80">{finalResult.aiSuggestion}</p>
            </div>

            <button onClick={resetQuiz} className="w-full bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow">
              Take Another Quiz
            </button>
        </div>
      </Card>
    );
  }

  if (quiz) {
    const question = quiz[currentQuestionIndex];
    return (
      <Card>
        <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mb-2">Question {currentQuestionIndex + 1} of {quiz.length}</p>
        <h2 className="text-xl font-medium mb-6">{question.question}</h2>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isAnswered = userAnswers[currentQuestionIndex] !== undefined;
            const isSelected = userAnswers[currentQuestionIndex] === index;
            const isCorrect = question.correctAnswer === index;
            
            let buttonClass = 'border-outline dark:border-dark-outline bg-surface-variant/30 dark:bg-dark-surface-variant/30 hover:bg-surface-variant/80';
            if (isAnswered) {
                if (isSelected && isCorrect) buttonClass = 'bg-tertiary-container text-on-tertiary-container border-tertiary-container/30';
                else if (isSelected && !isCorrect) buttonClass = 'bg-error-container text-on-error-container border-error-container/30';
                else if (isCorrect) buttonClass = 'bg-tertiary-container/50 border-tertiary-container/30';
            }
            
            return (
              <button 
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`w-full text-left p-4 border rounded-xl transition-all duration-300 ${buttonClass}`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-medium">AI Quiz Generator</h2>
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant">Enter any topic, and our AI will create a quiz to test your knowledge.</p>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border border-outline dark:border-dark-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
            placeholder="e.g., The Solar System, React Hooks"
          />
          {error && <p className="text-error text-sm">{error}</p>}
          <button onClick={handleStartQuiz} className="w-full bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow">
            Generate Quiz
          </button>
        </div>
      </Card>
    </div>
  );
};

export default QuizScreen;

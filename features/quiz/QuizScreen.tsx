import React, { useState } from 'react';
import Card from '../../components/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { generateQuiz, getPerformanceAnalysis } from '../../services/geminiService';
import type { QuizQuestion, QuizResult } from '../../types';

const Loader: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center space-y-4 py-16 animate-fade-in">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary dark:border-dark-primary"></div>
        <h2 className="text-xl font-medium">{message}</h2>
        <p className="text-on-surface-variant dark:text-dark-on-surface-variant max-w-xs">The AI is thinking. This might take a moment.</p>
    </div>
);

const QuizScreen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useLocalStorage<QuizResult[]>('quizResults', []);
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setError('Failed to generate quiz. The topic might be too niche. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while generating the quiz.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answerIndex: number) => {
    const newAnswers = [...userAnswers, answerIndex];
    setUserAnswers(newAnswers);

    setTimeout(async () => {
        if (currentQuestionIndex < (quiz?.length ?? 0) - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            const score = quiz!.reduce((acc, question, index) => {
                return acc + (question.correctAnswer === newAnswers[index] ? 1 : 0);
            }, 0);
            
            setIsLoading(true);
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
    }, 500);
  };
  
  const resetQuiz = () => {
      setQuiz(null);
      setTopic('');
      setUserAnswers([]);
      setCurrentQuestionIndex(0);
      setFinalResult(null);
  };
  
  if (isLoading) {
    return <Loader message={finalResult ? 'Analyzing performance...' : 'Generating your quiz...'} />;
  }
  
  if (finalResult) {
    const accuracy = (finalResult.score / finalResult.totalQuestions) * 100;
    return (
      <Card>
        <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant mb-4">{finalResult.topic}</p>
            <div className={`relative w-40 h-40 mx-auto flex items-center justify-center my-4`}>
                <svg className="absolute inset-0" viewBox="0 0 36 36">
                    <path className="stroke-current text-surface-variant/50 dark:text-dark-surface-variant/50" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4"></path>
                    <path className="stroke-current text-primary dark:text-dark-primary" strokeDasharray={`${accuracy}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="4" strokeLinecap="round"></path>
                </svg>
                <p className="text-5xl font-bold text-primary dark:text-dark-primary">{finalResult.score}<span className="text-2xl text-on-surface-variant">/{finalResult.totalQuestions}</span></p>
            </div>
            
            <div className="my-6 p-4 bg-primary-container/50 dark:bg-dark-primary-container/50 border border-transparent rounded-2xl">
                <h3 className="font-semibold text-on-primary-container dark:text-dark-on-primary-container mb-2">🤖 AI Suggestion</h3>
                <p className="text-sm text-on-primary-container/80 dark:text-dark-on-primary-container/80">{finalResult.aiSuggestion}</p>
            </div>

            <button onClick={resetQuiz} className="w-full bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full px-6 py-3 shadow-elevation-1 hover:shadow-elevation-2 transition-all transform hover:scale-[1.02]">
              Take Another Quiz
            </button>
        </div>
      </Card>
    );
  }

  if (quiz) {
    const question = quiz[currentQuestionIndex];
    return (
      <Card className="animate-fade-in">
        <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mb-2">Question {currentQuestionIndex + 1} of {quiz.length}</p>
        <h2 className="text-xl font-medium mb-6">{question.question}</h2>
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isAnswered = userAnswers.length > currentQuestionIndex;
            const isSelected = userAnswers[currentQuestionIndex] === index;
            const isCorrect = question.correctAnswer === index;
            
            let buttonClass = 'border-outline dark:border-dark-outline bg-surface dark:bg-dark-surface hover:bg-surface-variant/40';
            if (isAnswered) {
                if (isSelected && isCorrect) buttonClass = 'bg-tertiary-container text-on-tertiary-container border-tertiary-container ring-2 ring-tertiary-container';
                else if (isSelected && !isCorrect) buttonClass = 'bg-error-container text-on-error-container border-error-container ring-2 ring-error-container';
                else if (isCorrect) buttonClass = 'bg-tertiary-container/50 border-tertiary-container/30';
                else buttonClass = 'border-outline dark:border-dark-outline bg-surface dark:bg-dark-surface opacity-70';
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
    <Card>
        <form onSubmit={handleStartQuiz} className="space-y-4">
          <h2 className="text-2xl font-medium">AI Quiz Generator</h2>
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant">Enter any topic, and our AI will create a quiz to test your knowledge.</p>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="block w-full px-4 py-3 bg-surface-variant/40 dark:bg-dark-surface-variant/40 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary transition"
            placeholder="e.g., The Solar System, React Hooks"
          />
          {error && <p className="text-error text-sm">{error}</p>}
          <button type="submit" className="w-full bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full px-6 py-3 shadow-elevation-1 hover:shadow-elevation-2 transition-all transform hover:scale-[1.02]">
            Generate Quiz
          </button>
        </form>
    </Card>
  );
};

export default QuizScreen;
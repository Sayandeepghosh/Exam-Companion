import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { QuizResult } from '../../types';
import Card from '../../components/Card';

const ProgressScreen: React.FC = () => {
  const [quizResults] = useLocalStorage<QuizResult[]>('quizResults', []);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const chartData = useMemo(() => {
    return quizResults.map(result => ({
      name: new Date(result.date).toLocaleDateString(),
      topic: result.topic,
      score: (result.score / result.totalQuestions) * 100,
    })).slice(-10); // show last 10 results
  }, [quizResults]);
  
  const sortedResults = useMemo(() => {
    return [...quizResults].sort((a, b) => b.date - a.date);
  }, [quizResults]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Progress Tracker</h1>
      
      <Card>
        <h2 className="text-xl font-semibold mb-4">Recent Quiz Accuracy (%)</h2>
        {chartData.length > 0 ? (
          <div className="w-full h-72">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563', color: '#f3f4f6' }}
                  labelStyle={{ color: '#f3f4f6' }}
                  itemStyle={{ color: '#60a5fa' }}
                />
                <Bar dataKey="score" fill="#3b82f6" name="Score (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-10">No quiz results yet.</p>
        )}
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quiz History</h2>
        {sortedResults.length === 0 ? (
           <p className="text-gray-500 dark:text-gray-400">Complete a quiz to see your history here.</p>
        ) : (
          sortedResults.map(result => (
            <Card key={result.date} className="!p-0 overflow-hidden">
                <button 
                  className="w-full text-left p-4 flex justify-between items-center"
                  onClick={() => setExpandedId(expandedId === result.date ? null : result.date)}
                >
                  <div>
                    <h3 className="font-bold">{result.topic}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(result.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="font-bold text-lg">{result.score}/{result.totalQuestions}</div>
                </button>
                {expandedId === result.date && result.aiSuggestion && (
                    <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-800">
                      <div className="mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-900/30 rounded-lg">
                          <h4 className="font-semibold text-primary-800 dark:text-primary-200 mb-1 text-sm">🤖 AI Suggestion</h4>
                          <p className="text-sm text-primary-700 dark:text-primary-300">{result.aiSuggestion}</p>
                      </div>
                    </div>
                )}
            </Card>
          ))
        )}
      </div>

    </div>
  );
};

export default ProgressScreen;
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
    })).slice(-10);
  }, [quizResults]);
  
  const sortedResults = useMemo(() => {
    return [...quizResults].sort((a, b) => b.date - a.date);
  }, [quizResults]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-on-background dark:text-dark-on-background">Progress Tracker</h1>
      
      <Card>
        <h2 className="text-2xl font-medium mb-4">Recent Quiz Accuracy (%)</h2>
        {chartData.length > 0 ? (
          <div className="w-full h-72">
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-outline/30 dark:stroke-dark-outline/30" />
                <XAxis dataKey="name" className="text-xs" stroke="currentColor" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="currentColor" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                      backgroundColor: 'hsl(var(--color-dark-surface))',
                      border: '1px solid hsl(var(--color-dark-outline))',
                      color: 'hsl(var(--color-dark-on-surface))',
                      borderRadius: '16px'
                  }}
                  labelStyle={{ color: 'hsl(var(--color-dark-on-surface))' }}
                  itemStyle={{ color: 'hsl(var(--color-dark-primary))' }}
                  cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
                />
                <Bar dataKey="score" fill="#4285F4" name="Accuracy" unit="%" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant text-center py-10">Complete a quiz to see your progress chart.</p>
        )}
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-medium">Quiz History</h2>
        {sortedResults.length === 0 ? (
            <Card variant="outlined">
                <p className="text-on-surface-variant dark:text-dark-on-surface-variant text-center py-4">Your quiz history will appear here.</p>
            </Card>
        ) : (
          sortedResults.map(result => (
            <Card key={result.date} variant="outlined" className="!p-0 overflow-hidden animate-fade-in">
                <button 
                  className="w-full text-left p-4 flex justify-between items-center"
                  onClick={() => setExpandedId(expandedId === result.date ? null : result.date)}
                  aria-expanded={expandedId === result.date}
                >
                  <div>
                    <h3 className="font-medium text-lg">{result.topic}</h3>
                    <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                      {new Date(result.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-primary dark:text-dark-primary">{result.score}/{result.totalQuestions}</span>
                    <span className={`material-symbols-outlined transition-transform ${expandedId === result.date ? 'rotate-180' : ''}`}>expand_more</span>
                  </div>
                </button>
                {expandedId === result.date && result.aiSuggestion && (
                    <div className="px-4 pb-4 border-t border-outline/30 dark:border-dark-outline/30">
                      <div className="mt-4 p-3 bg-primary-container/50 dark:bg-dark-primary-container/50 rounded-2xl">
                          <h4 className="font-semibold text-on-primary-container dark:text-dark-on-primary-container mb-1 text-sm">🤖 AI Suggestion</h4>
                          <p className="text-sm text-on-primary-container/80 dark:text-dark-on-primary-container/80">{result.aiSuggestion}</p>
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
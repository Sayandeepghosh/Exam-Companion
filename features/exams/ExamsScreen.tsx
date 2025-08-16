import React, { useState } from 'react';
import Card from '../../components/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Exam } from '../../types';

const ExamsScreen: React.FC = () => {
  const [exams, setExams] = useLocalStorage<Exam[]>('exams', []);
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (examName.trim() && examDate) {
      const newExam: Exam = {
        id: Date.now(),
        name: examName.trim(),
        date: examDate,
      };
      setExams([...exams, newExam]);
      setExamName('');
      setExamDate('');
    }
  };

  const handleDeleteExam = (id: number) => {
    setExams(exams.filter(exam => exam.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Add New Exam</h2>
        <form onSubmit={handleAddExam} className="space-y-4">
          <div>
            <label htmlFor="examName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Name</label>
            <input
              type="text"
              id="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Final Physics Exam"
              required
            />
          </div>
          <div>
            <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Date</label>
            <input
              type="datetime-local"
              id="examDate"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            Add Exam
          </button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Exams</h2>
        {exams.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No exams added yet.</p>
        ) : (
          exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(exam => (
            <Card key={exam.id} className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{exam.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(exam.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <button
                onClick={() => handleDeleteExam(exam.id)}
                className="text-gray-400 hover:text-red-500 p-2 rounded-full transition-colors"
                aria-label="Delete exam"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamsScreen;
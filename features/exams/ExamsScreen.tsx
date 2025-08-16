import React, { useState } from 'react';
import Card from '../../components/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Exam } from '../../types';
import { TrashIcon } from '../../components/Icons';

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
        <h2 className="text-xl font-medium mb-4">Add New Exam</h2>
        <form onSubmit={handleAddExam} className="space-y-4">
          <div>
            <label htmlFor="examName" className="block text-sm font-medium text-on-surface-variant dark:text-dark-on-surface-variant mb-1">Exam Name</label>
            <input
              type="text"
              id="examName"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="block w-full px-4 py-3 bg-transparent border border-outline dark:border-dark-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
              placeholder="e.g., Final Physics Exam"
              required
            />
          </div>
          <div>
            <label htmlFor="examDate" className="block text-sm font-medium text-on-surface-variant dark:text-dark-on-surface-variant mb-1">Exam Date</label>
            <input
              type="datetime-local"
              id="examDate"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="block w-full px-4 py-3 bg-transparent border border-outline dark:border-dark-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
              required
            />
          </div>
          <button type="submit" className="w-full bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full px-6 py-3 shadow-sm hover:shadow-md transition-shadow">
            Add Exam
          </button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-medium">Your Exams</h2>
        {exams.length === 0 ? (
          <p className="text-on-surface-variant dark:text-dark-on-surface-variant">No exams added yet.</p>
        ) : (
          exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(exam => (
            <Card key={exam.id} className="!p-0">
                <div className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-medium text-lg">{exam.name}</h3>
                    <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                      {new Date(exam.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="group w-10 h-10 flex items-center justify-center rounded-full hover:bg-error/10 transition-colors"
                    aria-label="Delete exam"
                  >
                    <TrashIcon />
                  </button>
                </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamsScreen;

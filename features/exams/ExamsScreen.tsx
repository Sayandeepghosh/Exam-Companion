import React, { useState } from 'react';
import Card from '../../components/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import type { Exam } from '../../types';
import { TrashIcon } from '../../components/Icons';

const InputField: React.FC<{ id: string; label: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string; required?: boolean }> = 
({ id, label, type, value, onChange, placeholder, required }) => (
<div>
  <label htmlFor={id} className="block text-sm font-medium text-on-surface-variant dark:text-dark-on-surface-variant mb-2">{label}</label>
  <input
    type={type}
    id={id}
    value={value}
    onChange={onChange}
    className="block w-full px-4 py-3 bg-surface-variant/40 dark:bg-dark-surface-variant/40 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary focus:border-primary dark:focus:border-dark-primary transition"
    placeholder={placeholder}
    required={required}
  />
</div>
);

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
    <div className="space-y-8">
      <Card>
        <h2 className="text-2xl font-medium mb-4">Add New Exam</h2>
        <form onSubmit={handleAddExam} className="space-y-4">
          <InputField
            id="examName"
            label="Exam Name"
            type="text"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            placeholder="e.g., Final Physics Exam"
            required
          />
          <InputField
            id="examDate"
            label="Exam Date & Time"
            type="datetime-local"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-primary dark:bg-dark-primary text-on-primary dark:text-dark-on-primary font-medium rounded-full px-6 py-3 shadow-elevation-1 hover:shadow-elevation-2 transition-all transform hover:scale-[1.02]">
            Add Exam
          </button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-medium">Your Exams</h2>
        {exams.length === 0 ? (
          <Card variant="outlined">
            <p className="text-center text-on-surface-variant dark:text-dark-on-surface-variant py-4">No exams added yet.</p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {exams.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(exam => (
              <li key={exam.id} className="animate-fade-in">
                <Card variant="outlined" className="!p-0">
                  <div className="flex justify-between items-center p-4">
                    <div>
                      <h3 className="font-medium text-lg">{exam.name}</h3>
                      <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant">
                        {new Date(exam.date).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteExam(exam.id)}
                      className="group w-12 h-12 flex items-center justify-center rounded-full hover:bg-error-container/50 dark:hover:bg-error-container/50 transition-colors"
                      aria-label="Delete exam"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ExamsScreen;
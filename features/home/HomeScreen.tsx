import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getMotivationalQuote } from '../../services/geminiService';
import type { Exam } from '../../types';

const CountdownUnit: React.FC<{ value: number; label: string; }> = ({ value, label }) => (
    <div className="flex flex-col items-center justify-center bg-primary-container/50 dark:bg-dark-primary-container/50 p-4 rounded-2xl w-full">
        <span className="text-4xl lg:text-5xl font-bold text-primary dark:text-dark-primary tracking-tighter">
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-xs font-medium text-on-primary-container dark:text-dark-on-primary-container mt-1 uppercase">
            {label}
        </span>
    </div>
);


const Countdown: React.FC<{ nextExam: Exam | null }> = ({ nextExam }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nextExam) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const examDate = new Date(nextExam.date).getTime();
      const distance = examDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [nextExam]);

  if (!nextExam) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <h2 className="text-xl font-medium text-on-surface-variant dark:text-dark-on-surface-variant">No Upcoming Exams</h2>
        <p className="text-on-surface-variant/80 dark:text-dark-on-surface-variant/80 mt-1">Add an exam from the 'Exams' tab to start the countdown!</p>
      </div>
    );
  }

  return (
    <div className="text-center animate-fade-in">
      <p className="text-sm text-on-surface-variant dark:text-dark-on-surface-variant mb-2">Countdown to</p>
      <h2 className="text-xl font-medium text-on-surface dark:text-dark-on-surface mb-4">{nextExam.name}</h2>
      <div className="grid grid-cols-4 gap-2 md:gap-4 text-on-background dark:text-dark-on-background">
        <CountdownUnit value={timeLeft.days} label="Days" />
        <CountdownUnit value={timeLeft.hours} label="Hours" />
        <CountdownUnit value={timeLeft.minutes} label="Minutes" />
        <CountdownUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

const HomeScreen: React.FC = () => {
  const [exams] = useLocalStorage<Exam[]>('exams', []);
  const [quote, setQuote] = useState<string>('Loading quote...');

  const getNextExam = () => {
    const now = new Date().getTime();
    return exams
      .filter(exam => new Date(exam.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
  };

  useEffect(() => {
    const fetchQuote = async () => {
      const newQuote = await getMotivationalQuote();
      setQuote(newQuote);
    };
    fetchQuote();
  }, []);

  const nextExam = getNextExam();

  return (
    <div className="space-y-6">
      <Card>
        <Countdown nextExam={nextExam} />
      </Card>
      <Card variant="filled">
        <div className="text-center animate-fade-in" style={{ animationDelay: '150ms' }}>
          <h3 className="text-lg font-medium text-on-surface-variant dark:text-dark-on-surface-variant mb-2">Daily Motivation</h3>
          <p className="text-lg text-on-surface dark:text-dark-on-surface italic">"{quote}"</p>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
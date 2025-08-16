import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getMotivationalQuote } from '../../services/geminiService';
import type { Exam } from '../../types';

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
      <div className="text-center py-8">
        <h2 className="text-xl font-medium text-on-surface-variant dark:text-dark-on-surface-variant">No upcoming exams</h2>
        <p className="text-on-surface-variant/80 dark:text-dark-on-surface-variant/80 mt-1">Add an exam to start the countdown!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-lg font-medium text-on-surface dark:text-dark-on-surface mb-2">Countdown to <span className="font-bold text-primary dark:text-dark-primary">{nextExam.name}</span></h2>
      <div className="grid grid-cols-4 gap-4 text-on-background dark:text-dark-on-background">
        <div>
          <div className="text-4xl lg:text-5xl font-bold text-primary dark:text-dark-primary">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">Days</div>
        </div>
        <div>
          <div className="text-4xl lg:text-5xl font-bold text-primary dark:text-dark-primary">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">Hours</div>
        </div>
        <div>
          <div className="text-4xl lg:text-5xl font-bold text-primary dark:text-dark-primary">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">Minutes</div>
        </div>
        <div>
          <div className="text-4xl lg:text-5xl font-bold text-primary dark:text-dark-primary">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs text-on-surface-variant dark:text-dark-on-surface-variant">Seconds</div>
        </div>
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
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-medium text-on-surface dark:text-dark-on-surface mb-2">Daily Motivation</h3>
          <p className="text-lg text-on-surface-variant dark:text-dark-on-surface-variant">"{quote}"</p>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;

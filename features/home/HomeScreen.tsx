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
        <h2 className="text-xl font-semibold text-gray-500 dark:text-gray-400">No upcoming exams</h2>
        <p className="text-gray-400 mt-1">Add an exam to start the countdown!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Countdown to <span className="font-bold text-primary-500">{nextExam.name}</span></h2>
      <div className="grid grid-cols-4 gap-4 text-gray-800 dark:text-gray-100">
        <div className="p-2">
          <div className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400">{String(timeLeft.days).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Days</div>
        </div>
        <div className="p-2">
          <div className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Hours</div>
        </div>
        <div className="p-2">
          <div className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Minutes</div>
        </div>
        <div className="p-2">
          <div className="text-4xl lg:text-5xl font-bold text-primary-600 dark:text-primary-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Seconds</div>
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
    <div className="space-y-8">
      <Card>
        <Countdown nextExam={nextExam} />
      </Card>
      <Card>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Daily Motivation</h3>
          <p className="text-lg italic text-gray-600 dark:text-gray-400">"{quote}"</p>
        </div>
      </Card>
    </div>
  );
};

export default HomeScreen;
import React from 'react';
import type { Page } from '../types';
import { HomeIcon, ExamIcon, RevisionIcon, QuizIcon, NotesIcon } from './Icons';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  activePage: Page;
  setActivePage: (page: Page) => void;
  icon: React.ReactNode;
}> = ({ page, activePage, setActivePage, icon }) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => setActivePage(page)}
      className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-300 ${
        isActive ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
      }`}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{page}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const navItems: { page: Page; icon: React.ReactNode }[] = [
    { page: 'Home', icon: <HomeIcon /> },
    { page: 'Exams', icon: <ExamIcon /> },
    { page: 'Notes', icon: <NotesIcon /> },
    { page: 'Revision', icon: <RevisionIcon /> },
    { page: 'Quiz', icon: <QuizIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800">
        <div className="flex justify-around max-w-4xl mx-auto">
            {navItems.map((item) => (
                <NavItem key={item.page} {...item} activePage={activePage} setActivePage={setActivePage} />
            ))}
        </div>
    </nav>
  );
};

export default BottomNav;
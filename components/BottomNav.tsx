import React from 'react';
import type { Page } from '../types';
import { HomeIcon, ExamIcon, RevisionIcon, QuizIcon, NotesIcon } from './Icons';
import type { IconProps } from './Icons';

interface BottomNavProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  page: Page;
  activePage: Page;
  setActivePage: (page: Page) => void;
  icon: React.ReactElement<IconProps>;
}> = ({ page, activePage, setActivePage, icon }) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => setActivePage(page)}
      className="flex flex-col items-center justify-center flex-1 transition-colors duration-200 group h-20"
      aria-current={isActive ? 'page' : undefined}
    >
      <div className={`flex items-center justify-center h-8 w-16 rounded-full transition-colors ${isActive ? 'bg-secondary-container dark:bg-dark-primary-container' : 'group-hover:bg-on-surface/10'}`}>
          {React.cloneElement(icon, { isActive })}
      </div>
      <span className={`text-xs font-medium mt-1 transition-colors ${isActive ? 'text-on-surface dark:text-dark-on-surface' : 'text-on-surface-variant dark:text-dark-on-surface-variant'}`}>
          {page}
      </span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const navItems: { page: Page; icon: React.ReactElement }[] = [
    { page: 'Home', icon: <HomeIcon /> },
    { page: 'Exams', icon: <ExamIcon /> },
    { page: 'Notes', icon: <NotesIcon /> },
    { page: 'Revision', icon: <RevisionIcon /> },
    { page: 'Quiz', icon: <QuizIcon /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 bg-surface/95 dark:bg-dark-surface/95 backdrop-blur-lg border-t border-surface-variant dark:border-dark-surface-variant">
        <div className="flex justify-around max-w-4xl mx-auto">
            {navItems.map((item) => (
                <NavItem key={item.page} {...item} activePage={activePage} setActivePage={setActivePage} />
            ))}
        </div>
    </nav>
  );
};

export default BottomNav;
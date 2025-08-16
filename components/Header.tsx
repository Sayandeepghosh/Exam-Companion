import React from 'react';
import { Page } from '../types';
import { MenuIcon } from './Icons';

interface HeaderProps {
  activePage: Page;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gray-50/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-800/80">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{activePage}</h1>
      <button
        onClick={onMenuClick}
        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 transition-colors"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>
    </header>
  );
};

export default Header;
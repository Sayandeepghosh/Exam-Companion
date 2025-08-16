import React from 'react';
import { Page } from '../types';
import { MenuIcon } from './Icons';

interface HeaderProps {
  activePage: Page;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, onMenuClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 h-16 bg-surface/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-outline/20 dark:border-dark-outline/20">
      <h1 className="text-xl font-medium text-on-surface dark:text-dark-on-surface">{activePage}</h1>
      <button
        onClick={onMenuClick}
        className="flex items-center justify-center w-10 h-10 rounded-full text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-on-surface/10 dark:hover:bg-dark-on-surface/10 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
        aria-label="Open menu"
      >
        <MenuIcon />
      </button>
    </header>
  );
};

export default Header;

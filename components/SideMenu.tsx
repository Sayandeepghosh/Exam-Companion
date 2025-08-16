import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import type { Page } from '../types';
import { CloseIcon, SunIcon, MoonIcon, TableIcon, FormulaIcon, PuzzleIcon, ProgressIcon, TestbookIcon, FocusIcon } from './Icons';

interface SideMenuProps {
    isOpen: boolean;
    onClose: () => void;
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
      className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
        isActive ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
      }`}
    >
      <span className="mr-4">{icon}</span>
      <span className="font-medium">{page}</span>
    </button>
  );
};

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, activePage, setActivePage }) => {
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const navItems: { page: Page; icon: React.ReactNode }[] = [
        { page: 'Tables', icon: <TableIcon /> },
        { page: 'Formulas', icon: <FormulaIcon /> },
        { page: 'Puzzles', icon: <PuzzleIcon /> },
        { page: 'Focus', icon: <FocusIcon /> },
        { page: 'Progress', icon: <ProgressIcon /> },
        { page: 'Testbook', icon: <TestbookIcon /> },
    ];

    return (
        <>
            <div 
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />
            <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><CloseIcon /></button>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map(item => (
                        <NavItem key={item.page} {...item} activePage={activePage} setActivePage={setActivePage} />
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                         <span className="font-medium text-gray-700 dark:text-gray-300">Theme</span>
                         <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200/60 dark:hover:bg-gray-800/60"
                            aria-label="Toggle dark mode"
                          >
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                          </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default SideMenu;
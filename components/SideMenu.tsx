import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import type { Page } from '../types';
import { CloseIcon, SunIcon, MoonIcon, TableIcon, FormulaIcon, PuzzleIcon, ProgressIcon, TestbookIcon, FocusIcon } from './Icons';
import type { IconProps } from './Icons';

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
  icon: React.ReactElement<IconProps>;
}> = ({ page, activePage, setActivePage, icon }) => {
  const isActive = activePage === page;
  return (
    <button
      onClick={() => setActivePage(page)}
      className={`flex items-center w-full px-4 py-2.5 text-left rounded-full transition-colors ${
        isActive ? 'bg-primary-container dark:bg-dark-primary-container text-on-primary-container dark:text-dark-on-primary-container' : 'hover:bg-on-surface/10 text-on-surface-variant dark:text-dark-on-surface-variant'
      }`}
    >
      <span className="mr-3">{React.cloneElement(icon, { isActive })}</span>
      <span className="font-medium text-sm">{page}</span>
    </button>
  );
};

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, activePage, setActivePage }) => {
    const [isDarkMode, setIsDarkMode] = useDarkMode();
    const navItems: { page: Page; icon: React.ReactElement }[] = [
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
            <aside className={`fixed top-0 left-0 h-full w-80 bg-surface dark:bg-dark-surface shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between p-4 border-b border-outline/20 dark:border-dark-outline/20 h-16">
                    <h2 className="text-lg font-medium">Menu</h2>
                    <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-on-surface/10 dark:hover:bg-dark-on-surface/10"><CloseIcon /></button>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map(item => (
                        <NavItem key={item.page} {...item} activePage={activePage} setActivePage={setActivePage} />
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline/20 dark:border-dark-outline/20">
                    <div className="flex items-center justify-between">
                         <span className="font-medium text-on-surface dark:text-dark-on-surface">Theme</span>
                         <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant dark:text-dark-on-surface-variant hover:bg-on-surface/10 dark:hover:bg-dark-on-surface/10"
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
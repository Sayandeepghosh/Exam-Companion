import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import HomeScreen from './features/home/HomeScreen';
import ExamsScreen from './features/exams/ExamsScreen';
import TablesScreen from './features/tables/TablesScreen';
import RevisionScreen from './features/revision/RevisionScreen';
import TestbookScreen from './features/testbook/TestbookScreen';
import QuizScreen from './features/quiz/QuizScreen';
import ProgressScreen from './features/progress/ProgressScreen';
import FormulaScreen from './features/formulas/FormulaScreen';
import PuzzleScreen from './features/puzzles/PuzzleScreen';
import NotesScreen from './features/notes/NotesScreen';
import FocusScreen from './features/focus/FocusScreen';
import { Page } from './types';
import { useDarkMode } from './hooks/useDarkMode';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useDarkMode();

  const renderPage = () => {
    switch (activePage) {
      case 'Home': return <HomeScreen />;
      case 'Exams': return <ExamsScreen />;
      case 'Notes': return <NotesScreen />;
      case 'Revision': return <RevisionScreen />;
      case 'Quiz': return <QuizScreen />;
      case 'Tables': return <TablesScreen />;
      case 'Formulas': return <FormulaScreen />;
      case 'Puzzles': return <PuzzleScreen />;
      case 'Progress': return <ProgressScreen />;
      case 'Testbook': return <TestbookScreen />;
      case 'Focus': return <FocusScreen />;
      default: return <HomeScreen />;
    }
  };
  
  const handlePageSelect = (page: Page) => {
    setActivePage(page);
    setIsMenuOpen(false);
  }

  return (
    <div className="min-h-screen font-sans text-on-background bg-background dark:bg-dark-background dark:text-dark-on-background flex">
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} activePage={activePage} setActivePage={handlePageSelect} />
      
      <div className="flex-1 flex flex-col"> {/* Removed md:ml-80 for full-width layout */}
        <Header activePage={activePage} onMenuClick={() => setIsMenuOpen(true)} />
        <main className="flex-1 pt-16 pb-20 md:pb-8">
            <div className="container p-4 md:p-8 mx-auto max-w-5xl h-full">
            {renderPage()}
            </div>
        </main>
        {/* Bottom Nav only for mobile */}
        <div className="md:hidden">
            <BottomNav activePage={activePage} setActivePage={handlePageSelect} />
        </div>
      </div>
    </div>
  );
};

export default App;
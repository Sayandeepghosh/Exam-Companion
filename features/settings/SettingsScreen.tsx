
import React from 'react';
import Card from '../../components/Card';
import { useDarkMode } from '../../hooks/useDarkMode';

const SettingsScreen: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useDarkMode();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Settings</h1>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Dark Mode</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Reduce eye strain in low light.</p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              isDarkMode ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          >
            <span
              className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsScreen;

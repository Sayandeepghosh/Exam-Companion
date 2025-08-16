
import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('darkMode', false);

  useEffect(() => {
    const className = 'dark';
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add(className);
    } else {
      root.classList.remove(className);
    }
  }, [isDarkMode]);

  return [isDarkMode, setIsDarkMode] as const;
};

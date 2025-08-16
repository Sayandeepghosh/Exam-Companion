import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `bg-white dark:bg-gray-900/50 rounded-2xl shadow-sm border border-gray-200/80 dark:border-gray-800/80 overflow-hidden transition-all duration-300 ${className} ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-[1.01] hover:border-gray-300 dark:hover:border-gray-700' : ''}`;
  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
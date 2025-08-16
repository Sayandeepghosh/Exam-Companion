import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `bg-surface dark:bg-dark-surface rounded-3xl shadow-sm overflow-hidden transition-all duration-300 border border-outline/20 dark:border-dark-outline/20 ${className} ${onClick ? 'cursor-pointer hover:shadow-lg dark:hover:bg-dark-surface-variant/20' : ''}`;
  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;

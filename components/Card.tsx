import React from 'react';

type CardVariant = 'elevated' | 'filled' | 'outlined';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: CardVariant;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'elevated' }) => {
  const baseClasses = 'rounded-3xl overflow-hidden transition-all duration-300';
  
  const variantClasses = {
    elevated: 'bg-surface dark:bg-dark-surface shadow-elevation-1',
    filled: 'bg-surface-variant/50 dark:bg-dark-surface-variant/50',
    outlined: 'bg-surface dark:bg-dark-surface border border-outline/50 dark:border-dark-outline/50',
  };

  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-elevation-2 dark:hover:bg-dark-surface-variant/20' : '';

  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${clickableClasses} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
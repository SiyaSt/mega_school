import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div className={`card ${className}`} onClick={onClick ? (e) => onClick(e) : undefined}>
      {children}
    </div>
  );
};

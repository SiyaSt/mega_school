import React from 'react';
import { Card } from './Card';
import './SubjectCard.css';

interface SubjectCardProps {
  subject: string;
  icon?: string;
  onClick: () => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject, icon, onClick }) => {
  return (
    <Card className="subject-card" onClick={onClick}>
      <div className="subject-card-content">
        {icon && <div className="subject-icon">{icon}</div>}
        <h3 className="subject-name">{subject}</h3>
      </div>
    </Card>
  );
};

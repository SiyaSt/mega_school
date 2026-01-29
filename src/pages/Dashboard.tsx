import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard-main">
        <h1 className="dashboard-title">Личный кабинет</h1>
        <p className="dashboard-subtitle">Выберите режим</p>
        <div className="dashboard-choice">
          <Card className="dashboard-card" onClick={() => navigate('/dashboard/student')}>
            <div className="dashboard-card-icon">👤</div>
            <h2>Я ученик</h2>
            <p>Продолжить уроки, баллы, магазин</p>
            <Button variant="outline">Войти</Button>
          </Card>
          <Card className="dashboard-card" onClick={() => navigate('/dashboard/parent')}>
            <div className="dashboard-card-icon">👨‍👩‍👧</div>
            <h2>Я родитель</h2>
            <p>Статистика ребёнка, подписка, магазин</p>
            <Button variant="outline">Войти</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

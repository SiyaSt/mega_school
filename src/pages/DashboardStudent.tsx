import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import { useUserProgress } from '../context/UserProgressContext';
import './DashboardStudent.css';

const subjectNames: Record<string, string> = {
  russian: 'Русский язык',
  algebra: 'Алгебра',
  geometry: 'Геометрия',
  math: 'Математика',
  history: 'История',
};

export const DashboardStudent: React.FC = () => {
  const { user, children } = useAuth();
  const { points, lessons, isLoading } = useUserProgress();
  const child = children[0];

  return (
    <div className="dashboard-student">
      <div className="dashboard-student-main">
        <h1 className="dashboard-student-title">Личный кабинет ученика</h1>

        <Card className="profile-card">
          <h2>Профиль</h2>
          <p><strong>Имя:</strong> {child?.fullName ?? user?.login ?? '—'}</p>
          <p><strong>Класс:</strong> {child?.grade || '—'}</p>
          <p><strong>Баллы на счету:</strong> {isLoading ? '…' : points}</p>
        </Card>

        <div className="quick-actions">
          <h2>Быстрые действия</h2>
          <div className="quick-actions-grid">
            <Link to="/trial" className="btn btn-primary btn-large">Продолжить урок</Link>
            <Link to="/trial" className="btn btn-outline btn-large">Начать новый предмет</Link>
            <Link to="/store" className="btn btn-outline btn-large">В магазин</Link>
          </div>
        </div>

        <Card className="lessons-history">
          <h2>Последние уроки</h2>
          {lessons.length === 0 ? (
            <p className="no-lessons">Пока нет пройденных уроков. <Link to="/trial">Начните с пробного режима</Link>.</p>
          ) : (
            <ul>
              {lessons.slice(0, 5).map((l) => (
                <li key={l.id}>
                  <span>{subjectNames[l.subjectId] ?? l.subjectId}</span> — {l.topicName} (+{l.points} б.)
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

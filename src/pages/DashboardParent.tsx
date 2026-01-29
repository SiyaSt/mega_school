import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import { useUserProgress } from '../context/UserProgressContext';
import './DashboardParent.css';

const SUBJECT_NAMES: Record<string, string> = {
  russian: 'Русский язык', algebra: 'Алгебра', geometry: 'Геометрия',
  math: 'Математика', history: 'История',
};

export const DashboardParent: React.FC = () => {
  const { children } = useAuth();
  const { points, lessons, isLoading } = useUserProgress();
  const child = children[0];

  return (
    <div className="dashboard-parent">
      <div className="dashboard-parent-main">
        <h1 className="dashboard-parent-title">Личный кабинет родителя</h1>

        <Card className="parent-child-card">
          <h2>Информация о ребёнке</h2>
          <p><strong>ФИО:</strong> {child?.fullName ?? '—'}</p>
          <p><strong>Класс:</strong> {child?.grade || '—'}</p>
          <p><strong>Предметы:</strong> {child?.subjectIds?.length ? child.subjectIds.map((id) => SUBJECT_NAMES[id] ?? id).join(', ') : '—'}</p>
        </Card>

        <Card className="parent-stats-card">
          <h2>Статистика</h2>
          <p><strong>Пройдено уроков:</strong> {isLoading ? '…' : lessons.length}</p>
          <p><strong>Заработано баллов:</strong> {isLoading ? '…' : points}</p>
        </Card>

        <div className="parent-actions">
          <Link to="/store" className="btn btn-primary btn-large">Магазин</Link>
          <p className="parent-subscription">
            Управление подпиской (информация): в разработке.
          </p>
        </div>
      </div>
    </div>
  );
};

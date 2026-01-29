import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Mega School</h3>
          <p>Интерактивная платформа для обучения с ИИ-другом</p>
        </div>
        <div className="footer-section">
          <h4>Навигация</h4>
          <Link to="/dashboard">Личный кабинет</Link>
          <Link to="/store">Магазин</Link>
          <Link to="/about">О проекте</Link>
        </div>
        <div className="footer-section">
          <h4>Регистрация</h4>
          <Link to="/auth/login">Войти</Link>
          <Link to="/auth/register">Регистрация</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Mega School. Все права защищены.</p>
      </div>
    </footer>
  );
};

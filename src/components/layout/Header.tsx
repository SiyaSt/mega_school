import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

export const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Mega School</h1>
        </Link>
        <nav className="nav">
          <Link to="/trial" className="nav-link">Пробный режим</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Личный кабинет</Link>
              <Link to="/store" className="nav-link">Магазин</Link>
              <button type="button" className="nav-link nav-btn" onClick={handleLogout}>
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="nav-link">Войти</Link>
              <Link to="/auth/register" className="nav-link">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

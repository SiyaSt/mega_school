import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  const { login } = useAuth();
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginName.trim() || !password) {
      setError('Введите логин и пароль');
      return;
    }
    setLoading(true);
    try {
      await login(loginName.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-main">
        <Card className="auth-card">
          <h1 className="auth-title">Вход</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
              <label htmlFor="login">Логин</label>
              <input
                id="login"
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                autoComplete="username"
                placeholder="Введите логин"
                disabled={loading}
              />
            </div>
            <div className="auth-field">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Введите пароль"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading} className="auth-submit">
              {loading ? 'Вход…' : 'Войти'}
            </Button>
          </form>
          <p className="auth-footer">
            Нет аккаунта? <Link to="/auth/register">Зарегистрироваться</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

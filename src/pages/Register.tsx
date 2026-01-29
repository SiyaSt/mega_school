import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const SUBJECTS = [
  { id: "russian", name: "Русский язык" },
  { id: "algebra", name: "Алгебра" },
  { id: "geometry", name: "Геометрия" },
  { id: "literature", name: "Литература" },
];

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [email, setEmail] = useState("");
  const [childFullName, setChildFullName] = useState("");
  const [childGrade, setChildGrade] = useState("");
  const [subjectIds, setSubjectIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleSubject = (id: string) => {
    setSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginName.trim() || !password) {
      setError("Укажите логин и пароль");
      return;
    }
    if (password !== passwordRepeat) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      await register({
        login: loginName.trim(),
        password,
        email: email.trim() || undefined,
        child:
          childFullName.trim() || childGrade.trim()
            ? {
                fullName: childFullName.trim() || "Ребёнок",
                grade: childGrade.trim() || "",
                subjectIds,
              }
            : undefined,
      });
      navigate("/dashboard/parent", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-main">
        <Card className="auth-card auth-card-wide">
          <h1 className="auth-title">Регистрация</h1>
          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-section">
              <h2 className="auth-section-title">Ваши данные</h2>
              <div className="auth-field">
                <label htmlFor="login">Логин *</label>
                <input
                  id="login"
                  type="text"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  autoComplete="username"
                  placeholder="Логин"
                  disabled={loading}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="password">Пароль *</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Пароль"
                  disabled={loading}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="passwordRepeat">Повторите пароль *</label>
                <input
                  id="passwordRepeat"
                  type="password"
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Повторите пароль"
                  disabled={loading}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="email">Email или телефон</label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="example@mail.ru"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="auth-section">
              <h2 className="auth-section-title">Данные ребёнка</h2>
              <div className="auth-field">
                <label htmlFor="childName">ФИО ребёнка</label>
                <input
                  id="childName"
                  type="text"
                  value={childFullName}
                  onChange={(e) => setChildFullName(e.target.value)}
                  placeholder="Иван Иванов"
                  disabled={loading}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="childGrade">Класс</label>
                <input
                  id="childGrade"
                  type="text"
                  value={childGrade}
                  onChange={(e) => setChildGrade(e.target.value)}
                  placeholder="5"
                  disabled={loading}
                />
              </div>
              <div className="auth-field">
                <label>Предметы (чекбоксы)</label>
                <div className="auth-checkboxes">
                  {SUBJECTS.map((s) => (
                    <label key={s.id} className="auth-checkbox">
                      <input
                        type="checkbox"
                        checked={subjectIds.includes(s.id)}
                        onChange={() => toggleSubject(s.id)}
                        disabled={loading}
                      />
                      <span>{s.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="auth-submit">
              {loading ? "Регистрация…" : "Зарегистрироваться"}
            </Button>
          </form>
          <p className="auth-footer">
            Уже есть аккаунт? <Link to="/auth/login">Войти</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

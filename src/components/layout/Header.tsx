import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

export const Header: React.FC<{ flag?: boolean }> = ({ flag }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  // Логика для определения скролла
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header__inner">
        <Link to="/" className="logo">
          <h1>EDUKIDS</h1>
        </Link>
        <nav className="nav">
          <Link to="/trial" className="nav-link">
            Пробный режим
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Личный кабинет
              </Link>
              <Link to="/store" className="nav-link">
                Магазин
              </Link>
              <button
                type="button"
                className="nav-link nav-btn"
                onClick={handleLogout}
              >
                Выход
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="nav-link">
                Войти
              </Link>
              <Link to="/auth/register" className="nav-link">
                Регистрация
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

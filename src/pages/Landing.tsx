import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import "./Landing.css";
import placeholderImage from "../assets/image 1.png";

const teamMembers = [
  { id: 1, name: "Егор Давыдов", role: "Проджект (Team Lead)", photo: placeholderImage },
  { id: 2, name: "Софья Вакуненкова", role: "Продакт менеджер", photo: placeholderImage },
  { id: 3, name: "Дмитрий Данилов", role: "Архитектор-разработчик", photo: placeholderImage },
  { id: 4, name: "Платон Окладников", role: "Маркетолог", photo: placeholderImage },
  { id: 5, name: "Анжелика Николаева", role: "Аналитик-дизайнер", photo: placeholderImage },
  { id: 6, name: "Полина Нисифорова", role: "UI Дизайнер", photo: placeholderImage },
  { id: 7, name: "Тигран Палакян", role: "Финансист", photo: placeholderImage },
  { id: 8, name: "Анастасия Стеценко", role: "Исследователь", photo: placeholderImage },
  { id: 9, name: "Михаил Милькевич", role: "Помощник маркетолога", photo: placeholderImage },
  { id: 10, name: "Фуфик", role: "Наш маскот", photo: placeholderImage },
];

const learningSteps = [
  {
    icon: placeholderImage,
    title: "Смотри видео",
    description: "Короткие уроки в формате микро-видео, как в TikTok",
  },
  {
    icon: placeholderImage,
    title: "Занимайся с ИИ-другом",
    description: "Персональный помощник объяснит тему и поддержит",
  },
  {
    icon: placeholderImage,
    title: "Выполняй задания",
    description: "4 задания по теме для закрепления материала",
  },
  {
    icon: placeholderImage,
    title: "Получай баллы",
    description: "Зарабатывай баллы за ответы и обменивай на призы",
  },
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-main">
        <section className="hero">
          <div
            className="hero-video-bg"
            style={{ backgroundImage: `url(${placeholderImage})`, backgroundSize: "cover" }}
          />
          <Button
            size="large"
            onClick={() => navigate("/trial")}
            className="hero-cta"
          >
            Попробовать бесплатно
          </Button>
        </section>

        <section className="learning-steps">
          <h2 className="section-title">Как будет проходить обучение</h2>
          <div className="steps-grid">
            {learningSteps.map((step, index) => (
              <Card key={index} className="step-card">
                <div className="step-icon">
                  <img
                    src={step.icon}
                    alt={step.title}
                    className="step-icon-img"
                  />
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="team-section">
          <h2 className="section-title">Наша команда</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <Card key={member.id} className="team-card">
                <div className="team-photo">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="team-photo-img"
                  />
                </div>
                <h3 className="team-name">{member.name}</h3>
                <p className="team-role">{member.role}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

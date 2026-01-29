import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import "./Landing.css";
import videoBg from "../assets/dbltj.mp4";
import videoIcon from "../assets/video-icon.png";
import aiIcon from "../assets/ai-icon.png";
import assignmentIcon from "../assets/assignment-icon.png";
import pointsIcon from "../assets/points-icon.png";

import member1 from "../assets/member-1.jpg";
import member2 from "../assets/member-2.jpg";
import member3 from "../assets/member-3.jpg";
import member4 from "../assets/member-4.jpg";
import member5 from "../assets/member-5.jpg";
import member6 from "../assets/member-6.jpg";
import member7 from "../assets/member-7.jpg";
import member8 from "../assets/member-8.jpg";
import member9 from "../assets/member-9.jpg";
import member10 from "../assets/member-10.jpg";

const teamMembers = [
  {
    id: 1,
    name: "Давыдов Егор",
    role: "Проджект (Team Lead), разработчик",
    photo: member1,
  },
  {
    id: 2,
    name: "Вакуненкова Софья",
    role: "Продакт менеджер",
    photo: member2,
  },
  {
    id: 3,
    name: "Данилов Дмитрий",
    role: "Архитектор-разработчик",
    photo: member3,
  },
  {
    id: 4,
    name: "Окладников Платон",
    role: "Маркетолог",
    photo: member4,
  },
  {
    id: 5,
    name: "Николаева Анжелика",
    role: "Аналитик-дизайнер",
    photo: member5,
  },
  { id: 6, name: "Нисифорова Полина", role: "UI Дизайнер", photo: member6 },
  { id: 7, name: "Палакян Тигран", role: "Финансист", photo: member7 },
  {
    id: 8,
    name: "Стеценко Анастасия",
    role: "Исследователь-разработчик",
    photo: member8,
  },
  {
    id: 9,
    name: "Милькевич Михаил",
    role: "Помощник маркетолога",
    photo: member9,
  },
  {
    id: 10,
    name: "Фуфик",
    role: "Наш маскот",
    photo: member10,
  },
];

const learningSteps = [
  {
    icon: videoIcon,
    title: "Смотри видео",
    description: "Интересные уроки в формате коротких видео, как в TikTok",
  },
  {
    icon: aiIcon,
    title: "Занимайся с ИИ-другом",
    description: "Твой персональный помощник объяснит сложные темы и поддержит",
  },
  {
    icon: assignmentIcon,
    title: "Выполняй задания",
    description: "5 заданий после каждого урока для закрепления материала",
  },
  {
    icon: pointsIcon,
    title: "Получай баллы",
    description:
      "Зарабатывай баллы за правильные ответы и обменивай их на призы",
  },
];

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-main">
        {/* Hero Block */}
        <section className="hero">
          <video autoPlay muted loop playsInline className="hero-video-bg">
            <source src={videoBg} type="video/mp4" />
            Ваш браузер не поддерживает видео.
          </video>
          <Button
            size="large"
            onClick={() => navigate("/trial")}
            className="hero-cta"
          >
            Попробовать бесплатно
          </Button>
        </section>
        <Button
          size="large"
          onClick={() => navigate("/trial")}
          className="hero-cta"
        >
          Попробовать бесплатно
        </Button>
        {/* How Learning Works */}
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

        {/* Team Section */}
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

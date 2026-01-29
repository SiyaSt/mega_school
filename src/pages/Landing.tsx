import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import "./Landing.css";

import videoIcon from "../assets/video-icon.png";
import aiIcon from "../assets/ai-icon.png";
import assignmentIcon from "../assets/assignment-icon.png";
import pointsIcon from "../assets/points-icon.png";

// // Импорт изображений для членов команды
// import member1 from "../assets/team/member-1.jpg";
// import member2 from "../assets/team/member-2.jpg";
// import member3 from "../assets/team/member-3.jpg";
// import member4 from "../assets/team/member-4.jpg";
// import member5 from "../assets/team/member-5.jpg";
// import member6 from "../assets/team/member-6.jpg";
// import member7 from "../assets/team/member-7.jpg";
// import member8 from "../assets/team/member-8.jpg";
// import member9 from "../assets/team/member-9.jpg";
// import member10 from "../assets/team/member-10.jpg";

const teamMembers = [
  // { id: 1, name: "Анна Петрова", role: "Основатель проекта", photo: member1 },
  // { id: 2, name: "Иван Сидоров", role: "Главный разработчик", photo: member2 },
  // { id: 3, name: "Мария Козлова", role: "UX/UI дизайнер", photo: member3 },
  // {
  //   id: 4,
  //   name: "Дмитрий Волков",
  //   role: "Методист по математике",
  //   photo: member4,
  // },
  // {
  //   id: 5,
  //   name: "Елена Соколова",
  //   role: "Методист по русскому языку",
  //   // photo: member5,
  // },
  // // { id: 6, name: "Алексей Морозов", role: "AI-инженер", photo: member6 },
  // { id: 7, name: "Ольга Новикова", role: "Контент-менеджер", photo: member7 },
  // { id: 8, name: "Сергей Лебедев", role: "QA-инженер", photo: member8 },
  // { id: 9, name: "Татьяна Орлова", role: "Маркетолог", photo: member9 },
  // {
  //   id: 10,
  //   name: "Павел Смирнов",
  //   role: "Backend разработчик",
  //   photo: member10,
  // },
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
          <div className="hero-content">
            <h1 className="hero-title">
              Учись с удовольствием вместе с ИИ-другом!
            </h1>
            <p className="hero-description">
              Интерактивная платформа для школьников, где обучение превращается
              в увлекательное приключение. Смотри видео-уроки, выполняй задания
              с поддержкой ИИ-помощника и зарабатывай баллы за свои достижения.
            </p>
            <Button
              size="large"
              onClick={() => navigate("/trial")}
              className="hero-cta"
            >
              Попробовать бесплатно
            </Button>
          </div>
        </section>

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
                    onError={(e) => {
                      // Fallback если изображение не загрузилось
                      e.currentTarget.style.display = "none";
                      const fallback = document.createElement("div");
                      fallback.className = "team-photo-fallback";
                      fallback.textContent = member.name.charAt(0);
                      e.currentTarget.parentNode?.appendChild(fallback);
                    }}
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

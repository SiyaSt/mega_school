import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import './Landing.css';

const teamMembers = [
  { id: 1, name: 'Анна Петрова', role: 'Основатель проекта', photo: '👩‍💼' },
  { id: 2, name: 'Иван Сидоров', role: 'Главный разработчик', photo: '👨‍💻' },
  { id: 3, name: 'Мария Козлова', role: 'UX/UI дизайнер', photo: '👩‍🎨' },
  { id: 4, name: 'Дмитрий Волков', role: 'Методист по математике', photo: '👨‍🏫' },
  { id: 5, name: 'Елена Соколова', role: 'Методист по русскому языку', photo: '👩‍🏫' },
  { id: 6, name: 'Алексей Морозов', role: 'AI-инженер', photo: '👨‍🔬' },
  { id: 7, name: 'Ольга Новикова', role: 'Контент-менеджер', photo: '👩‍💼' },
  { id: 8, name: 'Сергей Лебедев', role: 'QA-инженер', photo: '👨‍🔧' },
  { id: 9, name: 'Татьяна Орлова', role: 'Маркетолог', photo: '👩‍💼' },
  { id: 10, name: 'Павел Смирнов', role: 'Backend разработчик', photo: '👨‍💻' },
];

const learningSteps = [
  {
    icon: '📹',
    title: 'Смотри видео',
    description: 'Интересные уроки в формате коротких видео, как в TikTok',
  },
  {
    icon: '🤖',
    title: 'Занимайся с ИИ-другом',
    description: 'Твой персональный помощник объяснит сложные темы и поддержит',
  },
  {
    icon: '✏️',
    title: 'Выполняй задания',
    description: '5 заданий после каждого урока для закрепления материала',
  },
  {
    icon: '⭐',
    title: 'Получай баллы',
    description: 'Зарабатывай баллы за правильные ответы и обменивай их на призы',
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
              Интерактивная платформа для школьников, где обучение превращается в увлекательное приключение. 
              Смотри видео-уроки, выполняй задания с поддержкой ИИ-помощника и зарабатывай баллы за свои достижения.
            </p>
            <Button
              size="large"
              onClick={() => navigate('/trial')}
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
                <div className="step-icon">{step.icon}</div>
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
                <div className="team-photo">{member.photo}</div>
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

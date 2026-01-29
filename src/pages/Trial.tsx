import React from "react";
import { useNavigate } from "react-router-dom";
import { SubjectCard } from "../components/common/SubjectCard";
import { Card } from "../components/common/Card";
import "./Trial.css";

import russianIcon from "../assets/russian-icon.png";
import algebraIcon from "../assets/algebra-icon.png";
import geometryIcon from "../assets/assignment-icon.png";
import literatureIcon from "../assets/history-icon.png";

const subjects = [
  { id: "russian", name: "Русский язык", icon: russianIcon },
  { id: "algebra", name: "Алгебра", icon: algebraIcon },
  { id: "geometry", name: "Геометрия", icon: geometryIcon },
  { id: "literature", name: "Литература", icon: literatureIcon },
];

export const Trial: React.FC = () => {
  const navigate = useNavigate();

  const handleSubjectSelect = (subjectId: string) => {
    navigate(`/lesson/setup?subject=${subjectId}`);
  };

  return (
    <div className="trial">
      <div className="trial-main">
        <div className="trial-container">
          <h1 className="trial-title">Пробный режим</h1>

          {/* Description Block */}
          <Card className="trial-description">
            <h2>Что такое пробный режим?</h2>
            <p>
              В пробном режиме вы можете бесплатно попробовать нашу платформу и
              познакомиться с форматом обучения. Выберите любой предмет и
              пройдите один урок полностью: посмотрите видео, выполните задания
              с ИИ-другом и получите баллы.
            </p>
            <p>
              Ограничения пробного режима: доступен только один урок на
              выбранный предмет. Для полного доступа ко всем материалам
              необходимо зарегистрироваться.
            </p>
          </Card>

          {/* Subject Selection */}
          <div className="subject-selection">
            <h2 className="selection-title">Выберите предмет</h2>
            <div className="subjects-grid">
              {subjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject.name}
                  icon={
                    <img
                      src={subject.icon}
                      alt={subject.name}
                      className="subject-icon-img"
                    />
                  }
                  onClick={() => handleSubjectSelect(subject.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

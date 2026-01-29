import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import './LessonSetup.css';

const subjectNames: Record<string, string> = {
  russian: 'Русский язык',
  algebra: 'Алгебра',
  geometry: 'Геометрия',
  literature: 'Литература',
};

export const LessonSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get('subject') || '';

  const subjectName = subjectId ? subjectNames[subjectId] || 'Предмет' : 'Предмет';

  if (!subjectId) {
    return (
      <div className="lesson-setup">
        <div className="lesson-setup-main">
          <Card className="error-card">
            <h2>Предмет не выбран</h2>
            <p>Пожалуйста, вернитесь и выберите предмет.</p>
            <Button onClick={() => navigate('/trial')}>Вернуться к выбору</Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleStartLesson = () => {
    navigate(`/lesson/play?subject=${subjectId}`);
  };

  return (
    <div className="lesson-setup">
      <div className="lesson-setup-main">
        <div className="lesson-setup-container">
          <div className="setup-header">
            <Button variant="outline" onClick={() => navigate('/trial')} className="back-btn">
              < Назад
            </Button>
            <h1 className="setup-title">Как будет проходить урок</h1>
            <div className="subject-badge">{subjectName}</div>
          </div>

          <Card className="setup-description">
            <h2>Формат урока</h2>
            <p>
              Каждый урок состоит из трёх частей: просмотр видео, выполнение заданий с ИИ-другом
              и получение баллов за правильные ответы.
            </p>
          </Card>

          <div className="lesson-flow">
            <div className="flow-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>?? Смотри видео</h3>
                <p>
                  Просмотри короткое обучающее видео по теме урока. Видео разбито на несколько частей,
                  которые можно переключать.
                </p>
              </div>
            </div>

            <div className="flow-arrow">v</div>

            <div className="flow-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>?? Занимайся с ИИ-другом</h3>
                <p>
                  Твой персональный ИИ-помощник предложит тебе 4 задания по теме.
                  Он будет поддерживать тебя и объяснять, если что-то непонятно.
                </p>
              </div>
            </div>

            <div className="flow-arrow">v</div>

            <div className="flow-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>? Получай баллы</h3>
                <p>
                  За каждый правильный ответ ты получаешь баллы. За попытку ответить
                  тоже начисляется небольшой балл. Все баллы можно потратить в магазине!
                </p>
              </div>
            </div>
          </div>

          <Card className="video-preview-card">
            <h3>Пример видео-урока</h3>
            <div className="video-preview">
              <div className="preview-placeholder">
                <div className="preview-icon">??</div>
                <p>Вертикальное видео, как в TikTok</p>
                <p className="preview-topic">Тема подбирается ИИ под предмет</p>
              </div>
            </div>
          </Card>

          <Card className="ai-friend-card">
            <h3>?? Твой ИИ-друг</h3>
            <p>
              ИИ-помощник — это твой персональный друг в обучении. Он не только проверяет
              твои ответы, но и поддерживает тебя, объясняет сложные моменты и радуется
              твоим успехам. Он всегда готов помочь!
            </p>
            <div className="ai-features">
              <div className="feature">? Поддерживает и мотивирует</div>
              <div className="feature">? Объясняет сложные темы</div>
              <div className="feature">? Даёт 4 задания по теме</div>
              <div className="feature">? Помогает учиться на ошибках</div>
            </div>
          </Card>

          <div className="start-lesson-section">
            <Button size="large" onClick={handleStartLesson} className="start-btn">
              Начать урок
            </Button>
            <p className="start-hint">Урок займёт примерно 8-12 минут</p>
          </div>
        </div>
      </div>
    </div>
  );
};

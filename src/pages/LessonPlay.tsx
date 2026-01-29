import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { VideoPlayerMock } from "../components/lesson/VideoPlayerMock";
import { ChatWithAI } from "../components/lesson/ChatWithAI";
import { getLessonTopic } from "../services/aiHelper";
import { useAuth } from "../context/AuthContext";
import { useUserProgress } from "../context/UserProgressContext";
import "./LessonPlay.css";

const subjectNames: Record<string, string> = {
  russian: "Русский язык",
  algebra: "Алгебра",
  geometry: "Геометрия",
  math: "Математика",
  history: "История",
};

export const LessonPlay: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get("subject") || "";
  const { isAuthenticated } = useAuth();
  const { registerLessonResult, childId } = useUserProgress();

  const [currentPoints, setCurrentPoints] = useState(0);
  const [maxPossiblePoints, setMaxPossiblePoints] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const lessonTopic = subjectId ? getLessonTopic(subjectId) : null;
  const subjectName = subjectId
    ? subjectNames[subjectId] || "Предмет"
    : "Предмет";

  useEffect(() => {
    if (lessonTopic) {
      const total = lessonTopic.questions.reduce((sum, q) => sum + q.points, 0);
      setMaxPossiblePoints(total);
    }
  }, [lessonTopic]);

  if (!lessonTopic) {
    return (
      <div className="lesson-play">
        <div className="lesson-play-main">
          <Card className="error-card">
            <h2>Предмет не выбран</h2>
            <p>Пожалуйста, вернитесь и выберите предмет.</p>
            <Button onClick={() => navigate("/trial")}>
              Вернуться к выбору
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handlePointsChange = (points: number) => {
    setCurrentPoints(points);
  };

  const handleComplete = async (totalPoints: number) => {
    if (isAuthenticated && lessonTopic) {
      try {
        await registerLessonResult({
          childId: childId ?? undefined,
          points: totalPoints,
          subjectId,
          topicName: lessonTopic.topicName,
        });
      } catch {
        // ignore; points still shown locally
      }
    }
    setIsCompleted(true);
  };

  return (
    <div className="lesson-play">
      <div className="lesson-play-main">
        <div className="lesson-play-container">
          <div className="lesson-header">
            <div className="lesson-title-section">
              <h1 className="lesson-subject">{subjectName}</h1>
              <p className="lesson-topic">{lessonTopic.topicName}</p>
            </div>
          </div>

          <div className="lesson-content">
            <div className="lesson-left">
              <div className="video-section">
                <VideoPlayerMock
                  subjectName={subjectName}
                  topicName={lessonTopic.topicName}
                />
              </div>
            </div>

            <div className="lesson-right">
              <div className="chat-section">
                <ChatWithAI
                  questions={lessonTopic.questions}
                  topicName={lessonTopic.topicName}
                  onPointsChange={handlePointsChange}
                  onComplete={handleComplete}
                />
              </div>
            </div>
          </div>
          <Card className="points-card">
            <h3 className="points-title">Баллы за урок</h3>
            <div className="points-display">
              <div className="points-current">
                <span className="points-label">Сейчас:</span>
                <span className="points-value">{currentPoints}</span>
              </div>
              <div className="points-max">
                <span className="points-label">Максимум:</span>
                <span className="points-value">{maxPossiblePoints}</span>
              </div>
            </div>
            <div className="points-progress">
              <div
                className="points-progress-bar"
                style={{
                  width: `${maxPossiblePoints > 0 ? Math.min((currentPoints / maxPossiblePoints) * 100, 100) : 0}%`,
                }}
              />
            </div>
            <p className="points-hint">
              За правильные ответы ты получаешь баллы. За попытку тоже
              начисляется балл!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from "react";
import type { Question, AIResponse } from "../../services/aiHelper";
import {
  checkAnswer,
  getWelcomeMessage,
  getCompletionMessage,
} from "../../services/aiHelper";
import "./ChatWithAI.css";

interface ChatMessage {
  id: number;
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  question?: Question;
  userAnswer?: string | number;
  pointsAwarded?: number;
}

interface ChatWithAIProps {
  questions: Question[];
  topicName: string;
  onPointsChange: (points: number) => void;
  onComplete: (totalPoints: number) => void;
}

export const ChatWithAI: React.FC<ChatWithAIProps> = ({
  questions,
  topicName,
  onPointsChange,
  onComplete,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [, setTotalPoints] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Инициализация: приветственное сообщение и первое задание
    if (questions.length === 0) return;

    messageIdCounter.current = 0;
    const welcomeMsg: ChatMessage = {
      id: messageIdCounter.current++,
      sender: "ai",
      text: getWelcomeMessage(topicName),
      timestamp: new Date(),
    };

    const firstQuestion: ChatMessage = {
      id: messageIdCounter.current++,
      sender: "ai",
      text: questions[0]?.question || "",
      timestamp: new Date(),
      question: questions[0],
    };

    setMessages([welcomeMsg, firstQuestion]);
    setCurrentQuestionIndex(0);
    setTotalPoints(0);
    setUserInput("");
    setSelectedOption(null);
    setIsWaitingForAnswer(false);
  }, [topicName, questions]);

  const handleSendAnswer = () => {
    if (isWaitingForAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    let answer: string | number;
    let answerText: string;

    if (currentQuestion.type === "choice") {
      if (selectedOption === null) return;
      answer = selectedOption;
      answerText = currentQuestion.options?.[selectedOption] || "";
    } else if (currentQuestion.type === "text") {
      if (!userInput.trim()) return;
      answer = userInput.trim();
      answerText = userInput.trim();
    } else {
      // photo type
      answer = "photo";
      answerText = "📸 Фото отправлено";
    }

    // Добавляем сообщение пользователя
    const userMessageId = messageIdCounter.current++;
    const userMessage: ChatMessage = {
      id: userMessageId,
      sender: "user",
      text: answerText,
      timestamp: new Date(),
      userAnswer: answer,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsWaitingForAnswer(true);

    // Имитация задержки ответа ИИ
    setTimeout(() => {
      const aiResponse: AIResponse = checkAnswer(currentQuestion, answer);
      let newTotalPoints = 0;
      setTotalPoints((prev) => {
        newTotalPoints = prev + aiResponse.pointsAwarded;
        onPointsChange(newTotalPoints);
        return newTotalPoints;
      });

      const aiMessageId = messageIdCounter.current++;
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        sender: "ai",
        text: aiResponse.message,
        timestamp: new Date(),
        pointsAwarded: aiResponse.pointsAwarded,
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Проверяем, есть ли следующее задание
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        setTimeout(() => {
          const nextQuestion = questions[nextIndex];
          const nextQuestionMessageId = messageIdCounter.current++;
          const nextQuestionMessage: ChatMessage = {
            id: nextQuestionMessageId,
            sender: "ai",
            text: nextQuestion.question,
            timestamp: new Date(),
            question: nextQuestion,
          };
          setMessages((prev) => [...prev, nextQuestionMessage]);
          setCurrentQuestionIndex(nextIndex);
          setIsWaitingForAnswer(false);
          setUserInput("");
          setSelectedOption(null);
        }, 1000);
      } else {
        // Все задания завершены
        setTimeout(() => {
          const completionMessageId = messageIdCounter.current++;
          const completionMessage: ChatMessage = {
            id: completionMessageId,
            sender: "ai",
            text: getCompletionMessage(newTotalPoints),
            timestamp: new Date(),
          };
          setMessages((prevMessages) => [...prevMessages, completionMessage]);
          setIsWaitingForAnswer(false);
          onComplete(newTotalPoints);
        }, 1000);
      }
    }, 800);
  };

  const handlePhotoUpload = () => {
    // Имитация загрузки фото
    const currentQuestion = questions[currentQuestionIndex] || null;
    if (currentQuestion?.type === "photo") {
      handleSendAnswer();
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || null;

  return (
    <div className="chat-with-ai">
      <div className="chat-header">
        <img
          className="ai-avatar"
          alt={" "}
          src={"src/assets/ai-icon.png"}
        ></img>
        <div>
          <h3>ИИ-друг</h3>
          <p className="chat-status">Онлайн • Помогает тебе учиться</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.sender === "ai" ? "ai-message" : "user-message"}`}
          >
            {message.sender === "ai" && (
              <img
                className="ai-avatar"
                alt={" "}
                src={"src/assets/ai-icon.png"}
              ></img>
            )}
            <div className="message-content">
              <p className="message-text">{message.text}</p>
              {message.pointsAwarded !== undefined &&
                message.pointsAwarded > 0 && (
                  <span className="points-badge">
                    +{message.pointsAwarded} баллов
                  </span>
                )}
              {message.question &&
                message.question.type === "choice" &&
                message.question.id === currentQuestion?.id && (
                  <div className="question-options">
                    {message.question.options?.map((option, index) => (
                      <button
                        key={index}
                        className={`option-btn ${selectedOption === index ? "selected" : ""}`}
                        onClick={() => setSelectedOption(index)}
                        disabled={isWaitingForAnswer}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
            </div>
            {message.sender === "user" && (
              <div className="message-avatar user-avatar">👤</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {currentQuestion && currentQuestionIndex < questions.length && (
        <div className="chat-input-area">
          {currentQuestion.type === "text" && (
            <input
              type="text"
              className="chat-input"
              placeholder="Введите ваш ответ..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !isWaitingForAnswer && handleSendAnswer()
              }
              disabled={isWaitingForAnswer}
            />
          )}
          {currentQuestion.type === "photo" && (
            <button
              className="photo-upload-btn"
              onClick={handlePhotoUpload}
              disabled={isWaitingForAnswer}
            >
              📸 Загрузить фото
            </button>
          )}
          {(currentQuestion.type === "text" ||
            currentQuestion.type === "photo") && (
            <button
              className="send-btn"
              onClick={handleSendAnswer}
              disabled={
                isWaitingForAnswer ||
                (currentQuestion.type === "text" && !userInput.trim())
              }
            >
              Отправить
            </button>
          )}
          {currentQuestion.type === "choice" && (
            <button
              className="send-btn"
              onClick={handleSendAnswer}
              disabled={isWaitingForAnswer || selectedOption === null}
            >
              Отправить ответ
            </button>
          )}
        </div>
      )}
    </div>
  );
};

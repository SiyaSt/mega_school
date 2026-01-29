import React, { useState, useEffect, useRef } from 'react';
import { aiChatService, type AiQuestion } from '../../services/aiChatService';
import './ChatWithAI.css';

interface ChatMessage {
  id: number;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  question?: AiQuestion;
  userAnswer?: string | number;
  pointsAwarded?: number;
}

interface ChatWithAIProps {
  subjectId: string;
  subjectName: string;
  totalQuestions: number;
  onTopicChange?: (topicName: string) => void;
  onPointsChange: (points: number) => void;
  onComplete: (totalPoints: number) => void;
}

export const ChatWithAI: React.FC<ChatWithAIProps> = ({
  subjectId,
  subjectName,
  totalQuestions,
  onTopicChange,
  onPointsChange,
  onComplete,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<AiQuestion | null>(null);
  const [userInput, setUserInput] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false);
  const [, setTotalPoints] = useState(0);
  const [topicName, setTopicName] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [previousQuestions, setPreviousQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let isActive = true;

    const startLesson = async () => {
      messageIdCounter.current = 0;
      setMessages([]);
      setCurrentQuestionIndex(0);
      setTotalPoints(0);
      setUserInput('');
      setSelectedOption(null);
      setIsWaitingForAnswer(true);
      setTopicName('');
      setSessionId(undefined);
      setPreviousQuestions([]);
      setCurrentQuestion(null);

      try {
        const res = await aiChatService.startLesson({
          subjectId,
          subjectName,
          totalQuestions,
        });
        if (!isActive) return;

        setTopicName(res.topicName);
        onTopicChange?.(res.topicName);
        setSessionId(res.sessionId);
        setCurrentQuestion(res.question);
        setPreviousQuestions([res.question.question]);

        const welcomeMsg: ChatMessage = {
          id: messageIdCounter.current++,
          sender: 'ai',
          text: res.welcomeMessage,
          timestamp: new Date(),
        };

        const firstQuestion: ChatMessage = {
          id: messageIdCounter.current++,
          sender: 'ai',
          text: res.question.question,
          timestamp: new Date(),
          question: res.question,
        };

        setMessages([welcomeMsg, firstQuestion]);
        setIsWaitingForAnswer(false);
      } catch {
        if (!isActive) return;
        setMessages([
          {
            id: messageIdCounter.current++,
            sender: 'ai',
            text: 'Не удалось подключиться к ИИ. Попробуй позже.',
            timestamp: new Date(),
          },
        ]);
        setIsWaitingForAnswer(false);
      }
    };

    if (subjectId) {
      void startLesson();
    }

    return () => {
      isActive = false;
    };
  }, [subjectId, subjectName, totalQuestions, onTopicChange]);

  const handleSendAnswer = async () => {
    if (isWaitingForAnswer) return;
    if (!currentQuestion) return;

    let answer: string | number;
    let answerText: string;
    let answerPayload: { type: 'choice' | 'text'; text?: string; index?: number };

    if (currentQuestion.type === 'choice') {
      if (selectedOption === null) return;
      answer = selectedOption;
      answerText = currentQuestion.options?.[selectedOption] || '';
      answerPayload = { type: 'choice', index: selectedOption, text: answerText };
    } else {
      if (!userInput.trim()) return;
      answer = userInput.trim();
      answerText = userInput.trim();
      answerPayload = { type: 'text', text: answerText };
    }

    const userMessageId = messageIdCounter.current++;
    const userMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      text: answerText,
      timestamp: new Date(),
      userAnswer: answer,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsWaitingForAnswer(true);

    try {
      const aiResponse = await aiChatService.answer({
        sessionId,
        subjectId,
        subjectName,
        topicName: topicName || subjectName,
        questionIndex: currentQuestionIndex,
        totalQuestions,
        question: currentQuestion,
        userAnswer: answerPayload,
        previousQuestions,
      });

      let newTotalPoints = 0;
      setTotalPoints((prev) => {
        newTotalPoints = prev + aiResponse.pointsAwarded;
        onPointsChange(newTotalPoints);
        return newTotalPoints;
      });

      const aiMessageId = messageIdCounter.current++;
      const feedbackText = aiResponse.explanation
        ? `${aiResponse.feedbackMessage}\n${aiResponse.explanation}`
        : aiResponse.feedbackMessage;
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        sender: 'ai',
        text: feedbackText,
        timestamp: new Date(),
        pointsAwarded: aiResponse.pointsAwarded,
      };

      setMessages((prev) => [...prev, aiMessage]);

      const nextIndex = currentQuestionIndex + 1;
      if (aiResponse.nextQuestion && nextIndex < totalQuestions) {
        const nextQuestionMessageId = messageIdCounter.current++;
        const nextQuestionMessage: ChatMessage = {
          id: nextQuestionMessageId,
          sender: 'ai',
          text: aiResponse.nextQuestion.question,
          timestamp: new Date(),
          question: aiResponse.nextQuestion,
        };
        setMessages((prev) => [...prev, nextQuestionMessage]);
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(aiResponse.nextQuestion);
        setPreviousQuestions((prev) => [...prev, aiResponse.nextQuestion.question]);
        setIsWaitingForAnswer(false);
        setUserInput('');
        setSelectedOption(null);
      } else {
        const completionMessageText =
          aiResponse.completionMessage ||
          'Урок завершён! Ты отлично поработал!';
        const completionMessageId = messageIdCounter.current++;
        const completionMessage: ChatMessage = {
          id: completionMessageId,
          sender: 'ai',
          text: completionMessageText,
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, completionMessage]);
        setIsWaitingForAnswer(false);
        onComplete(newTotalPoints);
      }
    } catch {
      const errorMessageId = messageIdCounter.current++;
      const errorMessage: ChatMessage = {
        id: errorMessageId,
        sender: 'ai',
        text: 'Не удалось получить ответ от ИИ. Попробуй ещё раз.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsWaitingForAnswer(false);
    }
  };

  return (
    <div className="chat-with-ai">
      <div className="chat-header">
        <div className="ai-avatar">🤖</div>
        <div>
          <h3>ИИ-друг</h3>
          <p className="chat-status">Онлайн • Помогает тебе учиться</p>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.sender === 'ai' ? 'ai-message' : 'user-message'}`}
          >
            {message.sender === 'ai' && (
              <div className="message-avatar">🤖</div>
            )}
            <div className="message-content">
              <p className="message-text">{message.text}</p>
              {message.pointsAwarded !== undefined && message.pointsAwarded > 0 && (
                <span className="points-badge">+{message.pointsAwarded} баллов</span>
              )}
              {message.question && message.question.type === 'choice' && message.question.id === currentQuestion?.id && (
                <div className="question-options">
                  {message.question.options?.map((option, index) => (
                    <button
                      key={index}
                      className={`option-btn ${selectedOption === index ? 'selected' : ''}`}
                      onClick={() => setSelectedOption(index)}
                      disabled={isWaitingForAnswer}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {message.sender === 'user' && (
              <div className="message-avatar user-avatar">👤</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {currentQuestion && currentQuestionIndex < totalQuestions && (
        <div className="chat-input-area">
          {currentQuestion.type === 'text' && (
            <input
              type="text"
              className="chat-input"
              placeholder="Введите ваш ответ..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isWaitingForAnswer && void handleSendAnswer()}
              disabled={isWaitingForAnswer}
            />
          )}
          {currentQuestion.type === 'text' && (
            <button
              className="send-btn"
              onClick={() => void handleSendAnswer()}
              disabled={isWaitingForAnswer || !userInput.trim()}
            >
              Отправить
            </button>
          )}
          {currentQuestion.type === 'choice' && (
            <button
              className="send-btn"
              onClick={() => void handleSendAnswer()}
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

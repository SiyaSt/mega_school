// AI Helper Service - заглушка для генерации заданий и ответов ИИ-друга

export type QuestionType = "choice" | "text" | "photo";

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[]; // для типа 'choice'
  correctAnswer?: string | number; // для проверки
  points: number;
}

export interface AIResponse {
  message: string;
  isCorrect: boolean;
  pointsAwarded: number;
  nextQuestion?: Question;
}

export interface LessonTopic {
  subjectId: string;
  subjectName: string;
  topicName: string;
  questions: Question[];
}

// Темы и задания для разных предметов
const lessonTopics: Record<string, LessonTopic> = {
  geography: {
    subjectId: "geography",
    subjectName: "География",
    topicName: "Река Амазонка",
    questions: [
      {
        id: 1,
        type: "choice",
        question: "Где находится река Амазонка?",
        options: ["В Южной Америке", "В Африке", "В Европе", "В Азии"],
        correctAnswer: 0,
        points: 10,
      },
      {
        id: 2,
        type: "text",
        question: "Назови океан, в который впадает Амазонка.",
        correctAnswer: "Атлантический",
        points: 10,
      },
      {
        id: 3,
        type: "choice",
        question: "Амазонка — самая ...?",
        options: [
          "длинная река мира",
          "полноводная река мира",
          "глубокая река мира",
          "холодная река мира",
        ],
        correctAnswer: 1,
        points: 10,
      },
      {
        id: 4,
        type: "text",
        question: "В какой стране находится большая часть бассейна Амазонки?",
        correctAnswer: "Бразилия",
        points: 15,
      },
      {
        id: 5,
        type: "photo",
        question: "Нарисуй или найди на карте реку Амазонку.",
        points: 5,
      },
    ],
  },
  math: {
    subjectId: "math",
    subjectName: "Математика (5-7 класс)",
    topicName: "Дроби и проценты",
    questions: [
      {
        id: 1,
        type: "choice",
        question: "Чему равна дробь 1/2 в процентах?",
        options: ["25%", "50%", "75%", "100%"],
        correctAnswer: 1,
        points: 10,
      },
      {
        id: 2,
        type: "text",
        question: "Выразите дробь 3/4 в процентах. Ответ: ?%",
        correctAnswer: "75",
        points: 10,
      },
      {
        id: 3,
        type: "choice",
        question: "Что больше: 1/3 или 1/4?",
        options: ["1/3", "1/4", "Они равны", "Нельзя сравнить"],
        correctAnswer: 0,
        points: 10,
      },
      {
        id: 4,
        type: "text",
        question: "Найдите 20% от числа 150. Ответ: ?",
        correctAnswer: "30",
        points: 15,
      },
      {
        id: 5,
        type: "photo",
        question: "Сфотографируйте решение задачи с дробями.",
        points: 5,
      },
    ],
  },  history: {
    subjectId: "history",
    subjectName: "История",
    topicName: "Древний Египет и пирамиды",
    questions: [
      {
        id: 1,
        type: "choice",
        question: "Где находятся пирамиды Гизы?",
        options: ["В Египте", "В Греции", "В Индии", "В Мексике"],
        correctAnswer: 0,
        points: 10,
      },
      {
        id: 2,
        type: "text",
        question: "Как называли правителя Древнего Египта?",
        correctAnswer: "Фараон",
        points: 10,
      },
      {
        id: 3,
        type: "choice",
        question: "Для чего строили пирамиды?",
        options: [
          "Как гробницы фараонов",
          "Как школы",
          "Как рынки",
          "Как храмы для богов Олимпа",
        ],
        correctAnswer: 0,
        points: 10,
      },
      {
        id: 4,
        type: "text",
        question: "Как называется самая большая пирамида в Гизе?",
        correctAnswer: "Пирамида Хеопса",
        points: 15,
      },
      {
        id: 5,
        type: "photo",
        question: "Нарисуй пирамиду или найди изображение пирамиды в Египте.",
        points: 5,
      },
    ],
  },};

// Получить тему урока по ID предмета
export function getLessonTopic(subjectId: string): LessonTopic | null {
  return lessonTopics[subjectId] || null;
}

// Проверить ответ на вопрос
export function checkAnswer(question: Question, userAnswer: string | number): AIResponse {
  let isCorrect = false;
  let message = "";
  let pointsAwarded = 0;

  switch (question.type) {
    case "choice":
      isCorrect = question.correctAnswer === userAnswer;
      if (isCorrect) {
        message = "Отлично! 🎉 Ты правильно ответил! Так держать!";
        pointsAwarded = question.points;
      } else {
        message =
          "Не страшно ошибаться! 💪 Давай попробуем ещё раз. Ошибки помогают учиться!";
        pointsAwarded = 1;
      }
      break;

    case "text": {
      const userAnswerLower = String(userAnswer).toLowerCase().trim();
      const correctAnswerLower = String(question.correctAnswer || "")
        .toLowerCase()
        .trim();
      isCorrect =
        userAnswerLower === correctAnswerLower ||
        correctAnswerLower.includes(userAnswerLower) ||
        userAnswerLower.includes(correctAnswerLower);

      if (isCorrect) {
        message = "Супер! ✨ Твой ответ правильный! Ты молодец!";
        pointsAwarded = question.points;
      } else {
        message = "Почти получилось! 🤔 Подумай ещё немного, ты справишься!";
        pointsAwarded = 1;
      }
      break;
    }

    case "photo":
      isCorrect = true;
      message = "Классно! 📸 Я вижу, что ты стараешься! Продолжай в том же духе!";
      pointsAwarded = question.points;
      break;

    default:
      message = "Спасибо за ответ! 👍";
      pointsAwarded = 1;
  }

  return {
    message,
    isCorrect,
    pointsAwarded,
  };
}

// Получить приветственное сообщение от ИИ-друга
export function getWelcomeMessage(topicName: string): string {
  const messages = [
    `Привет! 👋 Я твой ИИ-друг! Сегодня мы изучим тему "${topicName}". Я буду помогать тебе и поддерживать на каждом шаге!`,
    `Здравствуй! 🌟 Готов изучать "${topicName}"? Я здесь, чтобы помочь тебе разобраться и заработать баллы!`,
    `Привет, друг! 🚀 Сегодня нас ждёт интересная тема "${topicName}". Давай начнём наше приключение!`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

// Получить сообщение после завершения всех заданий
export function getCompletionMessage(totalPoints: number): string {
  return `Поздравляю! 🎉 Ты прошёл все задания! Ты заработал ${totalPoints} баллов! Ты просто супер! 🌟`;
}

/** Сервис ИИ-друга. Заглушка сейчас; позже можно заменить на вызовы реального ИИ-API. */
export interface AIHelperService {
  getTopic(subjectId: string): LessonTopic | null;
  getWelcome(topicName: string): string;
  getCompletion(totalPoints: number): string;
  checkAnswer(question: Question, userAnswer: string | number): AIResponse;
}

export const aiHelperService: AIHelperService = {
  getTopic: getLessonTopic,
  getWelcome: getWelcomeMessage,
  getCompletion: getCompletionMessage,
  checkAnswer,
};

// AI Helper Service - заглушка для генерации заданий и ответов ИИ-друга

export type QuestionType = 'choice' | 'text' | 'photo';

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
  russian: {
    subjectId: 'russian',
    subjectName: 'Русский язык',
    topicName: 'Правописание безударных гласных',
    questions: [
      {
        id: 1,
        type: 'choice',
        question: 'В каком слове пропущена буква "о"?',
        options: ['к...рень', 'к...рзина', 'к...рмушка', 'к...ртошка'],
        correctAnswer: 0, // к...рень
        points: 10,
      },
      {
        id: 2,
        type: 'text',
        question: 'Вставьте пропущенную букву в слово: м...л...ко',
        correctAnswer: 'молоко',
        points: 10,
      },
      {
        id: 3,
        type: 'choice',
        question: 'Выберите правильный вариант:',
        options: ['бел...зный', 'бел...сный', 'бел...зный', 'бел...сный'],
        correctAnswer: 1, // белосный (правильно: белосный)
        points: 10,
      },
      {
        id: 4,
        type: 'text',
        question: 'Напишите проверочное слово для слова "л...сной"',
        correctAnswer: 'лес',
        points: 15,
      },
      {
        id: 5,
        type: 'photo',
        question: 'Сфотографируйте выполненное задание по правописанию',
        points: 5,
      },
    ],
  },
  algebra: {
    subjectId: 'algebra',
    subjectName: 'Алгебра',
    topicName: 'Линейные уравнения',
    questions: [
      {
        id: 1,
        type: 'choice',
        question: 'Решите уравнение: 2x + 5 = 13',
        options: ['x = 4', 'x = 5', 'x = 6', 'x = 7'],
        correctAnswer: 0, // x = 4
        points: 10,
      },
      {
        id: 2,
        type: 'text',
        question: 'Решите уравнение: 3x - 7 = 14. Ответ: x = ?',
        correctAnswer: '7',
        points: 10,
      },
      {
        id: 3,
        type: 'choice',
        question: 'Какое значение x удовлетворяет уравнению: x/2 = 5?',
        options: ['x = 8', 'x = 10', 'x = 12', 'x = 15'],
        correctAnswer: 1, // x = 10
        points: 10,
      },
      {
        id: 4,
        type: 'text',
        question: 'Решите: 4(x + 3) = 20. Ответ: x = ?',
        correctAnswer: '2',
        points: 15,
      },
      {
        id: 5,
        type: 'photo',
        question: 'Сфотографируйте решение уравнения: 5x - 3 = 2x + 9',
        points: 5,
      },
    ],
  },
  geometry: {
    subjectId: 'geometry',
    subjectName: 'Геометрия',
    topicName: 'Площадь треугольника',
    questions: [
      {
        id: 1,
        type: 'choice',
        question: 'Как найти площадь треугольника?',
        options: ['S = a × b', 'S = (a × h) / 2', 'S = a²', 'S = a + b + c'],
        correctAnswer: 1,
        points: 10,
      },
      {
        id: 2,
        type: 'text',
        question: 'Найдите площадь треугольника с основанием 8 см и высотой 5 см. Ответ: ? см²',
        correctAnswer: '20',
        points: 10,
      },
      {
        id: 3,
        type: 'choice',
        question: 'Площадь треугольника равна 24 см², основание 6 см. Найдите высоту.',
        options: ['4 см', '6 см', '8 см', '12 см'],
        correctAnswer: 2, // 8 см
        points: 10,
      },
      {
        id: 4,
        type: 'text',
        question: 'Треугольник имеет стороны 5, 12, 13. Это прямоугольный треугольник? (да/нет)',
        correctAnswer: 'да',
        points: 15,
      },
      {
        id: 5,
        type: 'photo',
        question: 'Нарисуйте треугольник и найдите его площадь',
        points: 5,
      },
    ],
  },
  math: {
    subjectId: 'math',
    subjectName: 'Математика',
    topicName: 'Дроби и проценты',
    questions: [
      {
        id: 1,
        type: 'choice',
        question: 'Чему равна дробь 1/2 в процентах?',
        options: ['25%', '50%', '75%', '100%'],
        correctAnswer: 1, // 50%
        points: 10,
      },
      {
        id: 2,
        type: 'text',
        question: 'Выразите дробь 3/4 в процентах. Ответ: ?%',
        correctAnswer: '75',
        points: 10,
      },
      {
        id: 3,
        type: 'choice',
        question: 'Что больше: 1/3 или 1/4?',
        options: ['1/3', '1/4', 'Они равны', 'Нельзя сравнить'],
        correctAnswer: 0, // 1/3
        points: 10,
      },
      {
        id: 4,
        type: 'text',
        question: 'Найдите 20% от числа 150. Ответ: ?',
        correctAnswer: '30',
        points: 15,
      },
      {
        id: 5,
        type: 'photo',
        question: 'Сфотографируйте решение задачи с дробями',
        points: 5,
      },
    ],
  },
  history: {
    subjectId: 'history',
    subjectName: 'История',
    topicName: 'Древняя Русь',
    questions: [
      {
        id: 1,
        type: 'choice',
        question: 'В каком году произошло Крещение Руси?',
        options: ['988', '1015', '1054', '1113'],
        correctAnswer: 0, // 988
        points: 10,
      },
      {
        id: 2,
        type: 'text',
        question: 'Как звали первого правителя Древнерусского государства?',
        correctAnswer: 'рюрик',
        points: 10,
      },
      {
        id: 3,
        type: 'choice',
        question: 'Какая столица была у Древней Руси?',
        options: ['Москва', 'Киев', 'Новгород', 'Владимир'],
        correctAnswer: 1, // Киев
        points: 10,
      },
      {
        id: 4,
        type: 'text',
        question: 'Как назывался свод законов Древней Руси?',
        correctAnswer: 'русская правда',
        points: 15,
      },
      {
        id: 5,
        type: 'photo',
        question: 'Нарисуйте или сфотографируйте карту Древней Руси',
        points: 5,
      },
    ],
  },
};

// Получить тему урока по ID предмета
export function getLessonTopic(subjectId: string): LessonTopic | null {
  return lessonTopics[subjectId] || null;
}

// Проверить ответ на вопрос
export function checkAnswer(question: Question, userAnswer: string | number): AIResponse {
  let isCorrect = false;
  let message = '';
  let pointsAwarded = 0;

  switch (question.type) {
    case 'choice':
      isCorrect = question.correctAnswer === userAnswer;
      if (isCorrect) {
        message = 'Отлично! 🎉 Ты правильно ответил! Так держать!';
        pointsAwarded = question.points;
      } else {
        message = 'Не страшно ошибаться! 💪 Давай попробуем ещё раз. Помни: ошибки помогают нам учиться!';
        pointsAwarded = 1; // Балл за попытку
      }
      break;

    case 'text': {
      const userAnswerLower = String(userAnswer).toLowerCase().trim();
      const correctAnswerLower = String(question.correctAnswer || '').toLowerCase().trim();
      // Простая проверка: точное совпадение или содержит ключевые слова
      isCorrect = userAnswerLower === correctAnswerLower ||
                  correctAnswerLower.includes(userAnswerLower) ||
                  userAnswerLower.includes(correctAnswerLower);

      if (isCorrect) {
        message = 'Супер! ✨ Твой ответ правильный! Ты молодец!';
        pointsAwarded = question.points;
      } else {
        message = 'Почти получилось! 🤔 Подумай ещё немного, ты обязательно справишься!';
        pointsAwarded = 1;
      }
      break;
    }

    case 'photo':
      // Для фото всегда принимаем ответ и даём поддержку
      isCorrect = true;
      message = 'Классно! 📸 Я вижу, что ты стараешься! Продолжай в том же духе!';
      pointsAwarded = question.points;
      break;

    default:
      message = 'Спасибо за ответ! 👍';
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
  return `Поздравляю! 🎊 Ты прошёл все задания! Ты заработал ${totalPoints} баллов! Ты просто супер! 🌟`;
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

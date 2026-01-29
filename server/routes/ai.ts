import { Router } from 'express';
import crypto from 'crypto';

type QuestionType = 'choice' | 'text';

interface AiQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
}

interface FallbackQuestion extends AiQuestion {
  correctAnswer: string | number;
}

interface StartRequestBody {
  subjectId?: string;
  subjectName?: string;
  gradeRange?: string;
  totalQuestions?: number;
}

interface StartResponseBody {
  sessionId?: string;
  topicName: string;
  welcomeMessage: string;
  question: AiQuestion;
}

interface AnswerRequestBody {
  sessionId?: string;
  subjectId?: string;
  subjectName?: string;
  topicName?: string;
  questionIndex?: number;
  totalQuestions?: number;
  question?: AiQuestion;
  userAnswer?: {
    type: QuestionType | 'photo';
    text?: string;
    index?: number;
  };
  previousQuestions?: string[];
}

interface AnswerResponseBody {
  isCorrect: boolean;
  pointsAwarded: number;
  feedbackMessage: string;
  explanation?: string;
  nextQuestion?: AiQuestion | null;
  completionMessage?: string;
}

const router = Router();

const DEFAULT_TOTAL_QUESTIONS = 4;
const DEFAULT_GRADE_RANGE = '5-7';
const POINTS_FOR_CORRECT = 10;
const POINTS_FOR_ATTEMPT = 1;

const fallbackPools: Record<string, { topicName: string; questions: FallbackQuestion[] }> = {
  russian: {
    topicName: 'Орфограммы в корне слова',
    questions: [
      {
        id: 'ru-1',
        type: 'choice',
        question: 'В каком слове нужно написать букву "е"?',
        options: ['д...рево', 'г...ра', 'к...нь', 'г...род'],
        correctAnswer: 0,
      },
      {
        id: 'ru-2',
        type: 'text',
        question: 'Вставь пропущенную букву: м...локо',
        correctAnswer: 'молоко',
      },
      {
        id: 'ru-3',
        type: 'choice',
        question: 'Выбери правильное написание:',
        options: ['машина', 'мошина', 'мышына', 'мошына'],
        correctAnswer: 0,
      },
      {
        id: 'ru-4',
        type: 'text',
        question: 'Подбери проверочное слово к "л...сной"',
        correctAnswer: 'лес',
      },
    ],
  },
  algebra: {
    topicName: 'Линейные уравнения',
    questions: [
      {
        id: 'al-1',
        type: 'choice',
        question: 'Реши: 2x + 6 = 14',
        options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'],
        correctAnswer: 1,
      },
      {
        id: 'al-2',
        type: 'text',
        question: 'Реши: 3x - 9 = 0. Ответ: x = ?',
        correctAnswer: '3',
      },
      {
        id: 'al-3',
        type: 'choice',
        question: 'Реши: x/4 = 5',
        options: ['x = 10', 'x = 15', 'x = 20', 'x = 25'],
        correctAnswer: 2,
      },
      {
        id: 'al-4',
        type: 'text',
        question: 'Реши: 5(x + 2) = 25. Ответ: x = ?',
        correctAnswer: '3',
      },
    ],
  },
  geometry: {
    topicName: 'Площадь треугольника',
    questions: [
      {
        id: 'geo-1',
        type: 'choice',
        question: 'Формула площади треугольника:',
        options: ['S = a · b', 'S = (a · h) / 2', 'S = a²', 'S = a + b + c'],
        correctAnswer: 1,
      },
      {
        id: 'geo-2',
        type: 'text',
        question: 'Основание 8 см, высота 5 см. Найди площадь.',
        correctAnswer: '20',
      },
      {
        id: 'geo-3',
        type: 'choice',
        question: 'Площадь треугольника 30 см², основание 10 см. Найди высоту.',
        options: ['3 см', '4 см', '5 см', '6 см'],
        correctAnswer: 2,
      },
      {
        id: 'geo-4',
        type: 'text',
        question: 'Стороны 3, 4, 5. Это прямоугольный треугольник? (да/нет)',
        correctAnswer: 'да',
      },
    ],
  },
  literature: {
    topicName: 'Выразительные средства',
    questions: [
      {
        id: 'lit-1',
        type: 'choice',
        question: 'Что такое эпитет?',
        options: [
          'Сравнение предметов',
          'Художественное определение',
          'Повтор одинаковых звуков',
          'Прямое значение слова',
        ],
        correctAnswer: 1,
      },
      {
        id: 'lit-2',
        type: 'text',
        question: 'Как называется сравнение с союзом "как"?',
        correctAnswer: 'сравнение',
      },
      {
        id: 'lit-3',
        type: 'choice',
        question: 'Что такое метафора?',
        options: [
          'Перенос значения по сходству',
          'Повтор слова в конце строк',
          'Прямое описание героя',
          'Обращение к читателю',
        ],
        correctAnswer: 0,
      },
      {
        id: 'lit-4',
        type: 'text',
        question: 'Приведи пример эпитета (1-2 слова).',
        correctAnswer: 'золотая осень',
      },
    ],
  },
  default: {
    topicName: 'Базовые вопросы',
    questions: [
      {
        id: 'def-1',
        type: 'text',
        question: 'Что нового ты сегодня узнал?',
        correctAnswer: '',
      },
      {
        id: 'def-2',
        type: 'text',
        question: 'Сформулируй одно правило по теме.',
        correctAnswer: '',
      },
      {
        id: 'def-3',
        type: 'text',
        question: 'Приведи пример по теме.',
        correctAnswer: '',
      },
      {
        id: 'def-4',
        type: 'text',
        question: 'Сформулируй вопрос по теме.',
        correctAnswer: '',
      },
    ],
  },
};

const fallbackSessions = new Map<string, { subjectId: string; topicName: string; questions: FallbackQuestion[] }>();

const getEnv = (key: string) => (process.env[key] || '').trim();
const hasYandexCreds = () => Boolean(getEnv('YANDEX_API_KEY') && getEnv('YANDEX_FOLDER_ID'));
const logAiMode = () => {
  if (hasYandexCreds()) {
    console.log('AI mode: YandexGPT enabled');
  } else {
    console.warn('AI mode: fallback (missing YANDEX_API_KEY or YANDEX_FOLDER_ID)');
  }
};

const buildModelUri = () => {
  const folderId = getEnv('YANDEX_FOLDER_ID');
  const model = getEnv('YANDEX_MODEL') || 'yandexgpt-lite';
  const modelVersion = getEnv('YANDEX_MODEL_VERSION') || 'latest';
  return `gpt://${folderId}/${model}/${modelVersion}`;
};

const buildAnswerLabel = (userAnswer?: AnswerRequestBody['userAnswer']) => {
  if (!userAnswer) return 'Ответ отсутствует';
  if (userAnswer.type === 'choice') {
    return `Выбранный вариант: ${userAnswer.index ?? '—'} (${userAnswer.text ?? ''})`;
  }
  if (userAnswer.type === 'text') {
    return `Ответ пользователя: ${userAnswer.text ?? ''}`;
  }
  return 'Ответ: (фото/файл)';
};

const extractJson = (raw: string) => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      const candidate = trimmed.slice(start, end + 1);
      try {
        return JSON.parse(candidate);
      } catch {
        return null;
      }
    }
    return null;
  }
};

const callYandex = async (messages: { role: 'system' | 'user' | 'assistant'; text: string }[]) => {
  const apiKey = getEnv('YANDEX_API_KEY');
  const url = getEnv('YANDEX_API_URL') || 'https://llm.api.cloud.yandex.net/foundationModels/v1/completion';
  const body = {
    modelUri: buildModelUri(),
    completionOptions: {
      stream: false,
      temperature: 0.6,
      maxTokens: 700,
    },
    messages,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Api-Key ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'AI request failed');
  }

  const data = (await res.json()) as {
    result?: { alternatives?: { message?: { text?: string } }[] };
  };
  return data.result?.alternatives?.[0]?.message?.text ?? '';
};

const buildFallbackStart = (subjectId: string, totalQuestions: number): StartResponseBody => {
  const pool = fallbackPools[subjectId] || fallbackPools.default;
  const questions = pool.questions.slice(0, totalQuestions);
  const sessionId = crypto.randomUUID();
  fallbackSessions.set(sessionId, {
    subjectId,
    topicName: pool.topicName,
    questions,
  });
  return {
    sessionId,
    topicName: pool.topicName,
    welcomeMessage: `Привет! Я твой ИИ-друг. Сегодня мы изучим тему "${pool.topicName}". Готов?`,
    question: toPublicQuestion(questions[0]),
  };
};

const toPublicQuestion = (q: FallbackQuestion | AiQuestion): AiQuestion => ({
  id: q.id,
  type: q.type,
  question: q.question,
  options: q.options,
});

router.post('/start', async (req, res) => {
  logAiMode();
  const body = req.body as StartRequestBody;
  const subjectId = (body.subjectId || 'default').toLowerCase();
  const subjectName = body.subjectName || 'предмет';
  const gradeRange = body.gradeRange || DEFAULT_GRADE_RANGE;
  const totalQuestions = Math.max(1, Math.min(body.totalQuestions ?? DEFAULT_TOTAL_QUESTIONS, 10));

  if (!hasYandexCreds()) {
    return res.json(buildFallbackStart(subjectId, totalQuestions));
  }

  const systemPrompt =
    'Ты дружелюбный учитель для детей 5-7 классов. Отвечай только валидным JSON без лишнего текста.';
  const userPrompt = [
    `Предмет: ${subjectName} (${subjectId}).`,
    `Класс: ${gradeRange}.`,
    'Сгенерируй тему микро-урока и первый вопрос.',
    'Вопрос может быть типа "choice" (4 варианта) или "text" (краткий ответ).',
    'Формат JSON:',
    '{',
    '  "topicName": "строка",',
    '  "welcomeMessage": "строка",',
    '  "question": {',
    '    "type": "choice" | "text",',
    '    "question": "строка",',
    '    "options": ["...", "...", "...", "..."] // только если type = "choice"',
    '  }',
    '}',
    'Важно: возвращай только JSON.',
  ].join('\n');

  try {
    const raw = await callYandex([
      { role: 'system', text: systemPrompt },
      { role: 'user', text: userPrompt },
    ]);
    const parsed = extractJson(raw) as Partial<StartResponseBody> | null;
    if (!parsed?.question?.question || !parsed.topicName) {
      return res.json(buildFallbackStart(subjectId, totalQuestions));
    }
    return res.json({
      topicName: parsed.topicName,
      welcomeMessage: parsed.welcomeMessage || `Привет! Сегодня тема: "${parsed.topicName}".`,
      question: {
        id: crypto.randomUUID(),
        type: parsed.question.type ?? 'text',
        question: parsed.question.question,
        options: parsed.question.options,
      },
    } satisfies StartResponseBody);
  } catch {
    return res.json(buildFallbackStart(subjectId, totalQuestions));
  }
});

router.post('/answer', async (req, res) => {
  logAiMode();
  const body = req.body as AnswerRequestBody;
  const subjectId = (body.subjectId || 'default').toLowerCase();
  const subjectName = body.subjectName || 'предмет';
  const topicName = body.topicName || 'тема';
  const questionIndex = body.questionIndex ?? 0;
  const totalQuestions = Math.max(1, Math.min(body.totalQuestions ?? DEFAULT_TOTAL_QUESTIONS, 10));
  const isLast = questionIndex + 1 >= totalQuestions;

  if (!hasYandexCreds()) {
    const session = body.sessionId ? fallbackSessions.get(body.sessionId) : null;
    const fallbackQuestion = session?.questions?.[questionIndex];
    const isCorrect = (() => {
      if (!fallbackQuestion || !body.userAnswer) return false;
      if (fallbackQuestion.type === 'choice') {
        return fallbackQuestion.correctAnswer === body.userAnswer.index;
      }
      if (fallbackQuestion.type === 'text') {
        const expected = String(fallbackQuestion.correctAnswer).toLowerCase();
        const actual = String(body.userAnswer.text || '').toLowerCase().trim();
        return expected && actual.includes(expected);
      }
      return false;
    })();

    const pointsAwarded = isCorrect ? POINTS_FOR_CORRECT : POINTS_FOR_ATTEMPT;
    const nextQuestion = session?.questions?.[questionIndex + 1];
    const fallbackResponse: AnswerResponseBody = {
      isCorrect,
      pointsAwarded,
      feedbackMessage: isCorrect
        ? 'Отлично! Ты справился — молодец!'
        : 'Почти получилось. Давай попробуем следующий вопрос!',
      explanation: isCorrect ? undefined : 'Если нужно — перечитай правило и попробуй снова.',
      nextQuestion: !isLast && nextQuestion ? toPublicQuestion(nextQuestion) : null,
      completionMessage: isLast ? 'Урок завершён! Ты отлично поработал!' : undefined,
    };
    return res.json(fallbackResponse);
  }

  const systemPrompt =
    'Ты дружелюбный ИИ-наставник для детей 5-7 классов. Отвечай только валидным JSON без лишнего текста.';
  const questionText = body.question?.question || 'Вопрос отсутствует';
  const optionsText = body.question?.options?.length
    ? `Варианты: ${body.question.options.map((opt, i) => `${i + 1}) ${opt}`).join(' ')}`
    : '';
  const historyText = (body.previousQuestions || []).map((q, i) => `${i + 1}. ${q}`).join('\n');

  const userPrompt = [
    `Предмет: ${subjectName} (${subjectId}).`,
    `Тема урока: ${topicName}.`,
    `Класс: ${DEFAULT_GRADE_RANGE}.`,
    `Вопрос №${questionIndex + 1} из ${totalQuestions}.`,
    `Текст вопроса: ${questionText}`,
    optionsText,
    `Ответ ученика: ${buildAnswerLabel(body.userAnswer)}`,
    historyText ? `Предыдущие вопросы:\n${historyText}` : '',
    isLast
      ? 'Оцени ответ (правильно/неправильно), дай короткую поддержку и объяснение. Затем сформулируй финальное поздравление.'
      : 'Оцени ответ (правильно/неправильно), дай короткую поддержку и объяснение. Затем придумай следующий вопрос по теме (без повторов).',
    'Формат JSON:',
    '{',
    '  "isCorrect": true | false,',
    '  "feedbackMessage": "строка",',
    '  "explanation": "строка",',
    isLast
      ? '  "completionMessage": "строка"'
      : '  "nextQuestion": { "type": "choice" | "text", "question": "строка", "options": ["...", "...", "...", "..."] }',
    '}',
    'Важно: возвращай только JSON.',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const raw = await callYandex([
      { role: 'system', text: systemPrompt },
      { role: 'user', text: userPrompt },
    ]);
    const parsed = extractJson(raw) as Partial<AnswerResponseBody> | null;
    const isCorrect = Boolean(parsed?.isCorrect);
    const pointsAwarded = isCorrect ? POINTS_FOR_CORRECT : POINTS_FOR_ATTEMPT;

    const response: AnswerResponseBody = {
      isCorrect,
      pointsAwarded,
      feedbackMessage: parsed?.feedbackMessage || (isCorrect ? 'Отлично! Молодец!' : 'Ничего, попробуем ещё.'),
      explanation: parsed?.explanation,
      nextQuestion: parsed?.nextQuestion
        ? {
            id: crypto.randomUUID(),
            type: parsed.nextQuestion.type ?? 'text',
            question: parsed.nextQuestion.question || 'Новый вопрос',
            options: parsed.nextQuestion.options,
          }
        : null,
      completionMessage: parsed?.completionMessage,
    };

    return res.json(response);
  } catch {
    const fallbackResponse: AnswerResponseBody = {
      isCorrect: false,
      pointsAwarded: POINTS_FOR_ATTEMPT,
      feedbackMessage: 'Спасибо за ответ! Давай продолжим.',
      explanation: 'Если что-то непонятно — я помогу.',
      nextQuestion: null,
      completionMessage: isLast ? 'Урок завершён! Ты молодец!' : undefined,
    };
    return res.json(fallbackResponse);
  }
});

export default router;

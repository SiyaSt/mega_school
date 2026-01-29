import { api } from './apiClient';

export type QuestionType = 'choice' | 'text';

export interface AiQuestion {
  id?: string;
  type: QuestionType;
  question: string;
  options?: string[];
}

export interface StartLessonRequest {
  subjectId: string;
  subjectName: string;
  gradeRange?: string;
  totalQuestions: number;
}

export interface StartLessonResponse {
  sessionId?: string;
  topicName: string;
  welcomeMessage: string;
  question: AiQuestion;
}

export interface AnswerRequest {
  sessionId?: string;
  subjectId: string;
  subjectName: string;
  topicName: string;
  questionIndex: number;
  totalQuestions: number;
  question: AiQuestion;
  userAnswer: { type: QuestionType; text?: string; index?: number };
  previousQuestions?: string[];
}

export interface AnswerResponse {
  isCorrect: boolean;
  pointsAwarded: number;
  feedbackMessage: string;
  explanation?: string;
  nextQuestion?: AiQuestion | null;
  completionMessage?: string;
}

export const aiChatService = {
  startLesson: (payload: StartLessonRequest) => api.post<StartLessonResponse>('/ai/start', payload),
  answer: (payload: AnswerRequest) => api.post<AnswerResponse>('/ai/answer', payload),
};

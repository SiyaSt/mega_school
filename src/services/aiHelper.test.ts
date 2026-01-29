import { describe, it, expect } from 'vitest';
import {
  getLessonTopic,
  checkAnswer,
  getWelcomeMessage,
  getCompletionMessage,
  aiHelperService,
  type Question,
} from './aiHelper';

describe('aiHelperService', () => {
  it('returns topic for known subject', () => {
    const topic = getLessonTopic('algebra');
    expect(topic).not.toBeNull();
    expect(topic?.subjectId).toBe('algebra');
    expect(topic?.subjectName).toBe('Алгебра');
    expect(topic?.questions).toHaveLength(5);
  });

  it('returns null for unknown subject', () => {
    expect(getLessonTopic('unknown')).toBeNull();
  });

  it('each topic has 5 questions', () => {
    for (const id of ['russian', 'algebra', 'geometry', 'math', 'history']) {
      const topic = getLessonTopic(id);
      expect(topic).not.toBeNull();
      expect(topic!.questions).toHaveLength(5);
    }
  });

  it('checkAnswer choice: correct awards points', () => {
    const q: Question = {
      id: 1,
      type: 'choice',
      question: '?',
      options: ['A', 'B', 'C'],
      correctAnswer: 1,
      points: 10,
    };
    const res = checkAnswer(q, 1);
    expect(res.isCorrect).toBe(true);
    expect(res.pointsAwarded).toBe(10);
  });

  it('checkAnswer choice: wrong awards 1 point', () => {
    const q: Question = {
      id: 1,
      type: 'choice',
      question: '?',
      options: ['A', 'B', 'C'],
      correctAnswer: 1,
      points: 10,
    };
    const res = checkAnswer(q, 0);
    expect(res.isCorrect).toBe(false);
    expect(res.pointsAwarded).toBe(1);
  });

  it('checkAnswer text: correct awards points', () => {
    const q: Question = {
      id: 1,
      type: 'text',
      question: '?',
      correctAnswer: 'да',
      points: 15,
    };
    const res = checkAnswer(q, 'да');
    expect(res.isCorrect).toBe(true);
    expect(res.pointsAwarded).toBe(15);
  });

  it('checkAnswer photo: always accepted, awards points', () => {
    const q: Question = {
      id: 1,
      type: 'photo',
      question: 'Upload',
      points: 5,
    };
    const res = checkAnswer(q, 'photo');
    expect(res.isCorrect).toBe(true);
    expect(res.pointsAwarded).toBe(5);
  });

  it('getWelcomeMessage includes topic name', () => {
    const msg = getWelcomeMessage('Тест');
    expect(msg).toContain('Тест');
  });

  it('getCompletionMessage includes total points', () => {
    const msg = getCompletionMessage(42);
    expect(msg).toContain('42');
  });

  it('aiHelperService exposes same API', () => {
    expect(aiHelperService.getTopic('algebra')).toEqual(getLessonTopic('algebra'));
    expect(aiHelperService.getWelcome('X')).toContain('X');
    expect(aiHelperService.getCompletion(10)).toBe(getCompletionMessage(10));
    const q: Question = {
      id: 1,
      type: 'choice',
      question: '?',
      options: ['A'],
      correctAnswer: 0,
      points: 5,
    };
    expect(aiHelperService.checkAnswer(q, 0)).toEqual(checkAnswer(q, 0));
  });
});

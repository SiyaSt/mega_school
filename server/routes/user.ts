import { Router, Response } from 'express';
import { db, nextId } from '../data/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import type { JWTPayload } from '../types.js';

type AuthRequest = import('express').Request & { user: JWTPayload };

const router = Router();
router.use(authMiddleware);

router.get('/profile', (req, res: Response) => {
  const { userId } = (req as AuthRequest).user;
  const user = db.users.get(userId);
  if (!user) {
    res.status(404).json({ error: 'Пользователь не найден' });
    return;
  }
  const children = [...db.children.values()].filter((c) => c.userId === userId);
  res.json({
    user: {
      id: user.id,
      login: user.login,
      email: user.email,
      role: user.role,
    },
    children: children.map((c) => ({
      id: c.id,
      fullName: c.fullName,
      grade: c.grade,
      subjectIds: c.subjectIds,
    })),
  });
});

router.get('/progress', (req, res: Response) => {
  const { userId } = (req as AuthRequest).user;
  const children = [...db.children.values()].filter((c) => c.userId === userId);
  const child = children[0] ?? null;
  if (!child) {
    res.json({ points: 0, lessons: [], childId: null });
    return;
  }
  const points = db.pointsByChild.get(child.id) ?? 0;
  const lessons = [...db.lessons.values()]
    .filter((l) => l.childId === child.id)
    .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
    .slice(0, 20)
    .map((l) => ({
      id: l.id,
      subjectId: l.subjectId,
      topicName: l.topicName,
      points: l.points,
      completedAt: l.completedAt.toISOString(),
    }));
  res.json({ points, lessons, childId: child.id });
});

interface ProgressBody {
  childId?: string;
  points: number;
  subjectId: string;
  topicName: string;
}

router.post('/progress', (req, res: Response) => {
  const { userId } = (req as AuthRequest).user;
  const { childId: bodyChildId, points, subjectId, topicName } = req.body as ProgressBody;
  const children = [...db.children.values()].filter((c) => c.userId === userId);
  const child = bodyChildId
    ? children.find((c) => c.id === bodyChildId)
    : children[0] ?? null;
  if (!child) {
    res.status(400).json({ error: 'Нет привязанного ребёнка' });
    return;
  }
  if (typeof points !== 'number' || points < 0 || !subjectId || !topicName) {
    res.status(400).json({ error: 'Укажите points, subjectId, topicName' });
    return;
  }

  const lessonId = nextId('lesson');
  db.lessons.set(lessonId, {
    id: lessonId,
    childId: child.id,
    subjectId,
    topicName,
    points,
    completedAt: new Date(),
  });
  const prev = db.pointsByChild.get(child.id) ?? 0;
  db.pointsByChild.set(child.id, prev + points);

  res.status(201).json({
    lessonId,
    points: prev + points,
  });
});

export default router;

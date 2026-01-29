import { Router, Response } from 'express';
import { pool } from '../db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import type { JWTPayload } from '../types.js';

type AuthRequest = import('express').Request & { user: JWTPayload };

const router = Router();
router.use(authMiddleware);

router.get('/profile', async (req, res: Response) => {
  const { userId } = (req as AuthRequest).user;
  const userRes = await pool.query('SELECT id, login, email, role FROM users WHERE id = $1', [userId]);
  if (!userRes.rowCount) {
    res.status(404).json({ error: 'Пользователь не найден' });
    return;
  }
  const user = userRes.rows[0];
  const childrenRes = await pool.query(
    'SELECT id, full_name, grade, subject_ids FROM children WHERE user_id = $1 ORDER BY created_at ASC',
    [userId]
  );
  res.json({
    user: {
      id: user.id,
      login: user.login,
      email: user.email,
      role: user.role,
    },
    children: childrenRes.rows.map((c) => ({
      id: c.id,
      fullName: c.full_name,
      grade: c.grade,
      subjectIds: c.subject_ids,
    })),
  });
});

router.get('/progress', async (req, res: Response) => {
  const { userId } = (req as AuthRequest).user;
  const childRes = await pool.query(
    'SELECT id FROM children WHERE user_id = $1 ORDER BY created_at ASC LIMIT 1',
    [userId]
  );
  if (!childRes.rowCount) {
    res.json({ points: 0, lessons: [], childId: null });
    return;
  }
  const childId = childRes.rows[0].id as string;
  const pointsRes = await pool.query('SELECT points FROM child_points WHERE child_id = $1', [childId]);
  const points = pointsRes.rows[0]?.points ?? 0;

  const lessonsRes = await pool.query(
    `SELECT id, subject_id, topic_name, points, completed_at
     FROM lessons
     WHERE child_id = $1
     ORDER BY completed_at DESC
     LIMIT 20`,
    [childId]
  );

  res.json({
    points,
    lessons: lessonsRes.rows.map((l) => ({
      id: l.id,
      subjectId: l.subject_id,
      topicName: l.topic_name,
      points: l.points,
      completedAt: l.completed_at.toISOString(),
    })),
    childId,
  });
});

interface ProgressBody {
  childId?: string;
  points: number;
  subjectId: string;
  topicName: string;
}

router.post('/progress', async (req, res: Response) => {
  const { userId } = (req as AuthRequest).user;
  const { childId: bodyChildId, points, subjectId, topicName } = req.body as ProgressBody;

  if (typeof points !== 'number' || points < 0 || !subjectId || !topicName) {
    res.status(400).json({ error: 'Укажите points, subjectId, topicName' });
    return;
  }

  const childrenRes = await pool.query(
    'SELECT id FROM children WHERE user_id = $1 ORDER BY created_at ASC',
    [userId]
  );
  const children = childrenRes.rows.map((c) => c.id as string);
  const childId = bodyChildId && children.includes(bodyChildId) ? bodyChildId : children[0] ?? null;
  if (!childId) {
    res.status(400).json({ error: 'Нет привязанного ребёнка' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const lessonRes = await client.query(
      `INSERT INTO lessons (child_id, subject_id, topic_name, points)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [childId, subjectId, topicName, points]
    );

    const pointsRes = await client.query(
      `INSERT INTO child_points (child_id, points)
       VALUES ($1, $2)
       ON CONFLICT (child_id) DO UPDATE SET points = child_points.points + EXCLUDED.points
       RETURNING points`,
      [childId, points]
    );

    await client.query('COMMIT');

    res.status(201).json({
      lessonId: lessonRes.rows[0].id,
      points: pointsRes.rows[0].points,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('progress', err);
    res.status(500).json({ error: 'Ошибка при сохранении прогресса' });
  } finally {
    client.release();
  }
});

export default router;

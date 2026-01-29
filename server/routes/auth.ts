import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { signToken } from '../middleware/authMiddleware.js';
import type { User, ChildProfile, JWTPayload } from '../types.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

type AuthRequest = import('express').Request & { user: JWTPayload };

const router = Router();

interface RegisterBody {
  login: string;
  password: string;
  email?: string;
  child?: { fullName: string; grade: string; subjectIds: string[] };
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { login, password, email = '', child }: RegisterBody = req.body;
    if (!login?.trim() || !password) {
      res.status(400).json({ error: 'Укажите логин и пароль' });
      return;
    }

    const loginValue = login.trim();
    const loginLower = loginValue.toLowerCase();
    const passwordHash = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const existing = await client.query('SELECT id FROM users WHERE LOWER(login) = $1', [loginLower]);
      if (existing.rowCount) {
        await client.query('ROLLBACK');
        res.status(409).json({ error: 'Пользователь с таким логином уже существует' });
        return;
      }

      const userRes = await client.query(
        `INSERT INTO users (login, password_hash, email, role)
         VALUES ($1, $2, $3, $4)
         RETURNING id, login, email, role`,
        [loginValue, passwordHash, String(email || '').trim(), 'parent']
      );
      const user = userRes.rows[0] as Pick<User, 'id' | 'login' | 'email' | 'role'>;

      let childProfile: ChildProfile | null = null;
      if (child?.fullName?.trim()) {
        const childRes = await client.query(
          `INSERT INTO children (user_id, full_name, grade, subject_ids)
           VALUES ($1, $2, $3, $4)
           RETURNING id, full_name, grade, subject_ids`,
          [
            user.id,
            child.fullName.trim(),
            String(child.grade || '').trim(),
            Array.isArray(child.subjectIds) ? child.subjectIds : [],
          ]
        );
        const childRow = childRes.rows[0] as { id: string; full_name: string; grade: string; subject_ids: string[] };
        childProfile = {
          id: childRow.id,
          userId: user.id,
          fullName: childRow.full_name,
          grade: childRow.grade,
          subjectIds: childRow.subject_ids,
          createdAt: new Date(),
        };
        await client.query('INSERT INTO child_points (child_id, points) VALUES ($1, $2)', [childProfile.id, 0]);
      }

      await client.query('COMMIT');

      const token = signToken({ userId: user.id, login: user.login, role: user.role });
      res.status(201).json({
        token,
        user,
        child: childProfile
          ? {
              id: childProfile.id,
              fullName: childProfile.fullName,
              grade: childProfile.grade,
              subjectIds: childProfile.subjectIds,
            }
          : null,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (e) {
    console.error('register', e);
    res.status(500).json({ error: 'Ошибка при регистрации' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { login, password } = req.body;
    if (!login?.trim() || !password) {
      res.status(400).json({ error: 'Укажите логин и пароль' });
      return;
    }
    const loginLower = login.trim().toLowerCase();
    const userRes = await pool.query(
      'SELECT id, login, email, role, password_hash FROM users WHERE LOWER(login) = $1',
      [loginLower]
    );
    if (!userRes.rowCount) {
      res.status(401).json({ error: 'Неверный логин или пароль' });
      return;
    }
    const user = userRes.rows[0] as User & { password_hash: string };
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      res.status(401).json({ error: 'Неверный логин или пароль' });
      return;
    }

    const token = signToken({ userId: user.id, login: user.login, role: user.role });
    const childrenRes = await pool.query(
      'SELECT id, full_name, grade, subject_ids FROM children WHERE user_id = $1 ORDER BY created_at ASC',
      [user.id]
    );
    res.json({
      token,
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
  } catch (e) {
    console.error('login', e);
    res.status(500).json({ error: 'Ошибка при входе' });
  }
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const r = req as AuthRequest;
  const userRes = await pool.query('SELECT id, login, email, role FROM users WHERE id = $1', [r.user.userId]);
  if (!userRes.rowCount) {
    res.status(404).json({ error: 'Пользователь не найден' });
    return;
  }
  const user = userRes.rows[0];
  const childrenRes = await pool.query(
    'SELECT id, full_name, grade, subject_ids FROM children WHERE user_id = $1 ORDER BY created_at ASC',
    [user.id]
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

export default router;

import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mega_school_dev_secret_change_in_production';

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function authMiddleware(req: Request & { user?: JWTPayload }, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Требуется авторизация' });
    return;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Недействительный или истёкший токен' });
    return;
  }
  req.user = payload;
  next();
}

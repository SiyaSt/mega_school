import { Router, Response } from 'express';
import { pool } from '../db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import type { JWTPayload } from '../types.js';

type AuthRequest = import('express').Request & { user: JWTPayload };

const router = Router();

router.get('/items', async (_req, res: Response) => {
  const itemsRes = await pool.query(
    'SELECT id, name, description, price_in_points, image_url FROM store_items ORDER BY name ASC'
  );
  const items = itemsRes.rows.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    priceInPoints: item.price_in_points,
    imageUrl: item.image_url ?? undefined,
  }));
  res.json({ items });
});

router.post('/purchase', authMiddleware, async (req, res: Response) => {
  const { userId } = (req as AuthRequest).user;
  const { itemId, childId: bodyChildId } = req.body;
  if (!itemId) {
    res.status(400).json({ error: 'Укажите itemId' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const itemRes = await client.query(
      'SELECT id, price_in_points FROM store_items WHERE id = $1',
      [itemId]
    );
    if (!itemRes.rowCount) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Товар не найден' });
      return;
    }
    const item = itemRes.rows[0];

    const childrenRes = await client.query(
      'SELECT id FROM children WHERE user_id = $1 ORDER BY created_at ASC',
      [userId]
    );
    const children = childrenRes.rows.map((c) => c.id as string);
    const childId = bodyChildId && children.includes(bodyChildId) ? bodyChildId : children[0] ?? null;
    if (!childId) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Нет привязанного ребёнка' });
      return;
    }

    const balanceRes = await client.query(
      'SELECT points FROM child_points WHERE child_id = $1',
      [childId]
    );
    const balance = balanceRes.rows[0]?.points ?? 0;
    if (balance < item.price_in_points) {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Недостаточно баллов' });
      return;
    }

    const purchaseRes = await client.query(
      `INSERT INTO purchases (child_id, item_id, price_paid)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [childId, item.id, item.price_in_points]
    );

    const newBalanceRes = await client.query(
      'UPDATE child_points SET points = points - $1 WHERE child_id = $2 RETURNING points',
      [item.price_in_points, childId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      purchaseId: purchaseRes.rows[0].id,
      itemId: item.id,
      pricePaid: item.price_in_points,
      newBalance: newBalanceRes.rows[0].points,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('purchase', err);
    res.status(500).json({ error: 'Ошибка при покупке' });
  } finally {
    client.release();
  }
});

export default router;

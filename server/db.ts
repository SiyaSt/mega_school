import { Pool } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL || '';

if (!DATABASE_URL) {
  console.warn('DATABASE_URL is not set. Backend auth/store endpoints will fail.');
}

export const pool = new Pool({
  connectionString: DATABASE_URL,
});

export async function initDb(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        login TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        email TEXT NOT NULL DEFAULT '',
        role TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS children (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        full_name TEXT NOT NULL,
        grade TEXT NOT NULL DEFAULT '',
        subject_ids TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS child_points (
        child_id UUID PRIMARY KEY REFERENCES children(id) ON DELETE CASCADE,
        points INT NOT NULL DEFAULT 0
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
        subject_id TEXT NOT NULL,
        topic_name TEXT NOT NULL,
        points INT NOT NULL,
        completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS store_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price_in_points INT NOT NULL,
        image_url TEXT
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
        item_id UUID NOT NULL REFERENCES store_items(id) ON DELETE CASCADE,
        price_paid INT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM store_items');
    if (rows[0]?.count === 0) {
      const seed = [
        { name: 'Футболка Mega School', description: 'Стильная футболка с логотипом', price: 150 },
        { name: 'Значок "Отличник"', description: 'Ачивка за старание', price: 50 },
        { name: 'Оформление профиля "Звёздное"', description: 'Уникальный стиль профиля', price: 200 },
        { name: 'Блокнот Mega School', description: 'Для заметок и решений', price: 80 },
        { name: 'Рюкзак школьный', description: 'Символический рюкзак в профиле', price: 300 },
      ];
      for (const item of seed) {
        await client.query(
          'INSERT INTO store_items (name, description, price_in_points) VALUES ($1, $2, $3)',
          [item.name, item.description, item.price]
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

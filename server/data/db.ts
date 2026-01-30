import type { User, ChildProfile, LessonRecord, StoreItem, Purchase } from '../types.js';

export interface Db {
  users: Map<string, User>;
  children: Map<string, ChildProfile>;
  lessons: Map<string, LessonRecord>;
  storeItems: Map<string, StoreItem>;
  purchases: Map<string, Purchase>;
  /** login -> userId for fast lookup */
  loginIndex: Map<string, string>;
  /** childId -> total points (derived, updated on lesson finish) */
  pointsByChild: Map<string, number>;
}

function createDb(): Db {
  const db: Db = {
    users: new Map(),
    children: new Map(),
    lessons: new Map(),
    storeItems: new Map(),
    purchases: new Map(),
    loginIndex: new Map(),
    pointsByChild: new Map(),
  };

  // Seed store items
  const items: Omit<StoreItem, 'id'>[] = [
    { name: 'Футболка EduKids', description: 'Стильная футболка с логотипом', priceInPoints: 150 },
    { name: 'Значок "Отличник"', description: 'Ачивка за старание', priceInPoints: 50 },
    { name: 'Оформление профиля "Звёздное"', description: 'Уникальный стиль профиля', priceInPoints: 200 },
    { name: 'Блокнот Edukids', description: 'Для заметок и решений', priceInPoints: 80 },
    { name: 'Рюкзак школьный', description: 'Символический рюкзак в профиле', priceInPoints: 300 },
  ];
  items.forEach((item, i) => {
    const id = `item-${i + 1}`;
    db.storeItems.set(id, { ...item, id });
  });

  return db;
}

export const db = createDb();

export function nextId(prefix: string): string {
  const n = Math.floor(Math.random() * 1e9) + Date.now() % 1e6;
  return `${prefix}-${n}`;
}

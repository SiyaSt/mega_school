function createDb() {
    const db = {
        users: new Map(),
        children: new Map(),
        lessons: new Map(),
        storeItems: new Map(),
        purchases: new Map(),
        loginIndex: new Map(),
        pointsByChild: new Map(),
    };
    // Seed store items
    const items = [
        { name: 'Футболка Mega School', description: 'Стильная футболка с логотипом', priceInPoints: 150 },
        { name: 'Значок "Отличник"', description: 'Ачивка за старание', priceInPoints: 50 },
        { name: 'Оформление профиля "Звёздное"', description: 'Уникальный стиль профиля', priceInPoints: 200 },
        { name: 'Блокнот Mega School', description: 'Для заметок и решений', priceInPoints: 80 },
        { name: 'Рюкзак школьный', description: 'Символический рюкзак в профиле', priceInPoints: 300 },
    ];
    items.forEach((item, i) => {
        const id = `item-${i + 1}`;
        db.storeItems.set(id, { ...item, id });
    });
    return db;
}
export const db = createDb();
export function nextId(prefix) {
    const n = Math.floor(Math.random() * 1e9) + Date.now() % 1e6;
    return `${prefix}-${n}`;
}

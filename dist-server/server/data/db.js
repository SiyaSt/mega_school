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
        { name: 'Футболка EduKids', description: 'Стильная футболка с логотипом'},
        { name: 'Значок "Отличник"', description: 'Ачивка за старание'},
        { name: 'Оформление профиля "Звёздное"', description: 'Уникальный стиль профиля'},
        { name: 'Блокнот EduKids', description: 'Для заметок и решений'},
        { name: 'Рюкзак школьный', description: 'Символический рюкзак в профиле'},
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

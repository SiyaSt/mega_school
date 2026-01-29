import { Router } from 'express';
import { db, nextId } from '../data/db.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/items', (_req, res) => {
    const items = [...db.storeItems.values()].map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        priceInPoints: item.priceInPoints,
        imageUrl: item.imageUrl,
    }));
    res.json({ items });
});
router.post('/purchase', authMiddleware, (req, res) => {
    const { userId } = req.user;
    const { itemId, childId: bodyChildId } = req.body;
    const item = itemId ? db.storeItems.get(itemId) : null;
    if (!item) {
        res.status(404).json({ error: 'Товар не найден' });
        return;
    }
    const children = [...db.children.values()].filter((c) => c.userId === userId);
    const child = bodyChildId
        ? children.find((c) => c.id === bodyChildId)
        : children[0] ?? null;
    if (!child) {
        res.status(400).json({ error: 'Нет привязанного ребёнка' });
        return;
    }
    const balance = db.pointsByChild.get(child.id) ?? 0;
    if (balance < item.priceInPoints) {
        res.status(400).json({ error: 'Недостаточно баллов' });
        return;
    }
    const purchaseId = nextId('purchase');
    db.purchases.set(purchaseId, {
        id: purchaseId,
        childId: child.id,
        itemId: item.id,
        pricePaid: item.priceInPoints,
        createdAt: new Date(),
    });
    db.pointsByChild.set(child.id, balance - item.priceInPoints);
    res.status(201).json({
        purchaseId,
        itemId: item.id,
        pricePaid: item.priceInPoints,
        newBalance: balance - item.priceInPoints,
    });
});
export default router;

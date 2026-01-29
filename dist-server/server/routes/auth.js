import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db, nextId } from '../data/db.js';
import { signToken } from '../middleware/authMiddleware.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
const router = Router();
router.post('/register', async (req, res) => {
    try {
        const { login, password, email = '', child } = req.body;
        if (!login?.trim() || !password) {
            res.status(400).json({ error: 'Укажите логин и пароль' });
            return;
        }
        if (db.loginIndex.has(login.trim().toLowerCase())) {
            res.status(409).json({ error: 'Пользователь с таким логином уже существует' });
            return;
        }
        const userId = nextId('user');
        const passwordHash = await bcrypt.hash(password, 10);
        const user = {
            id: userId,
            login: login.trim(),
            passwordHash,
            email: String(email || '').trim(),
            role: 'parent',
            createdAt: new Date(),
        };
        db.users.set(userId, user);
        db.loginIndex.set(login.trim().toLowerCase(), userId);
        let childProfile = null;
        if (child?.fullName?.trim()) {
            const childId = nextId('child');
            childProfile = {
                id: childId,
                userId,
                fullName: child.fullName.trim(),
                grade: String(child.grade || '').trim(),
                subjectIds: Array.isArray(child.subjectIds) ? child.subjectIds : [],
                createdAt: new Date(),
            };
            db.children.set(childId, childProfile);
            db.pointsByChild.set(childId, 0);
        }
        const token = signToken({ userId, login: user.login, role: user.role });
        res.status(201).json({
            token,
            user: {
                id: user.id,
                login: user.login,
                email: user.email,
                role: user.role,
            },
            child: childProfile
                ? {
                    id: childProfile.id,
                    fullName: childProfile.fullName,
                    grade: childProfile.grade,
                    subjectIds: childProfile.subjectIds,
                }
                : null,
        });
    }
    catch (e) {
        console.error('register', e);
        res.status(500).json({ error: 'Ошибка при регистрации' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login?.trim() || !password) {
            res.status(400).json({ error: 'Укажите логин и пароль' });
            return;
        }
        const userId = db.loginIndex.get(login.trim().toLowerCase());
        if (!userId) {
            res.status(401).json({ error: 'Неверный логин или пароль' });
            return;
        }
        const user = db.users.get(userId);
        if (!user) {
            res.status(401).json({ error: 'Неверный логин или пароль' });
            return;
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            res.status(401).json({ error: 'Неверный логин или пароль' });
            return;
        }
        const token = signToken({ userId: user.id, login: user.login, role: user.role });
        const children = [...db.children.values()].filter((c) => c.userId === user.id);
        res.json({
            token,
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
    }
    catch (e) {
        console.error('login', e);
        res.status(500).json({ error: 'Ошибка при входе' });
    }
});
router.get('/me', authMiddleware, (req, res) => {
    const r = req;
    const user = db.users.get(r.user.userId);
    if (!user) {
        res.status(404).json({ error: 'Пользователь не найден' });
        return;
    }
    const children = [...db.children.values()].filter((c) => c.userId === user.id);
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
export default router;

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import storeRoutes from './routes/store.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/store', storeRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '127.0.0.1';
app.listen(PORT, HOST, () => {
  console.log(`Mega School API listening on http://${HOST}:${PORT}`);
});

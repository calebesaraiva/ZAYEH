import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from './lib/prisma';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import couponsRouter from './routes/coupons';
import dashboardRouter from './routes/dashboard';
import authRouter from './routes/auth';
import { ensureStoreBootstrap } from './lib/bootstrapStore';

const app = express();

function parseAllowedOrigins(value?: string) {
  if (!value) return '*';
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (!origins.length) return '*';
  return origins;
}

void ensureStoreBootstrap(prisma).catch((error) => {
  console.error('Erro ao sincronizar catalogo inicial da loja:', error);
});

app.use(cors({ origin: parseAllowedOrigins(process.env.FRONTEND_URL), credentials: true }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.get('/api/settings', async (_req, res) => {
  try {
    const rows = await prisma.setting.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    res.json(map);
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
});

app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !String(email).includes('@')) {
      return res.status(400).json({ error: 'E-mail inválido' });
    }
    await prisma.newsletter.upsert({
      where: { email },
      update: { subscribedAt: new Date() },
      create: { email },
    });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Erro ao cadastrar e-mail' });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/coupons', couponsRouter);
app.use('/api/dashboard', dashboardRouter);

export default app;

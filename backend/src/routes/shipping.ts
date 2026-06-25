import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { quoteShipping, ShippingQuoteError } from '../lib/shipping';

const router = Router();

router.post('/quote', async (req, res) => {
  try {
    const quote = await quoteShipping(prisma, {
      cepDestino: req.body?.cepDestino,
      subtotal: req.body?.subtotal,
      serviceCode: req.body?.serviceCode,
      freeShipping: req.body?.freeShipping,
    });
    res.json(quote);
  } catch (error) {
    const status = error instanceof ShippingQuoteError ? error.status : 500;
    const message = error instanceof Error ? error.message : 'Erro ao calcular frete';
    res.status(status).json({ error: message });
  }
});

export default router;

import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// POST /api/coupons/validate
router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) return res.status(400).json({ error: 'Código obrigatório' });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon || !coupon.active) return res.status(404).json({ error: 'Cupom inválido ou inativo' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return res.status(400).json({ error: 'Cupom expirado' });
    if (coupon.maxUses && coupon.uses >= coupon.maxUses) return res.status(400).json({ error: 'Cupom esgotado' });
    if (orderTotal < coupon.minOrder) {
      return res.status(400).json({ error: `Pedido mínimo de R$ ${coupon.minOrder.toFixed(2)} para este cupom` });
    }

    const discount = coupon.type === 'percent'
      ? (orderTotal * coupon.value) / 100
      : coupon.type === 'frete' ? 0
      : coupon.value;

    res.json({
      valid: true, code: coupon.code, type: coupon.type,
      value: coupon.value, discount: +discount.toFixed(2),
      freeShipping: coupon.freeShipping || coupon.type === 'frete',
    });
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;

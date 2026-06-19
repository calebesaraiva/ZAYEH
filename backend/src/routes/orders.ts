import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { getProductPricing, getStorePricingSettings } from '../lib/storePricing';

const router = Router();

const REQUIRED_DELIVERY_FIELDS = ['cep', 'rua', 'num', 'bairro', 'cidade', 'estado'] as const;

function parseBool(value?: string) {
  return value === 'true';
}

function parseNumber(value?: string, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// POST /api/orders — create order from checkout
router.post('/', async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      customerCpf,
      items,
      paymentMethod,
      deliveryMethod,
      address,
      couponCode,
      discount,
    } = req.body;

    if (!customerName || !customerEmail || !items?.length || !paymentMethod) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const selectedDeliveryMethod = deliveryMethod === 'pickup' ? 'pickup' : 'delivery';
    const normalizedAddress = address && typeof address === 'object' ? address : null;
    const paymentMethodText = String(paymentMethod).trim();
    const isPixPayment = paymentMethodText.toLowerCase().includes('pix');

    const [settingsRows, pricingSettings] = await Promise.all([
      prisma.setting.findMany(),
      getStorePricingSettings(prisma),
    ]);
    const settings = Object.fromEntries(settingsRows.map((row) => [row.key, row.value]));
    const deliveryEnabled = settings.deliveryEnabled !== undefined ? parseBool(settings.deliveryEnabled) : true;
    const pickupEnabled = settings.pickupEnabled !== undefined ? parseBool(settings.pickupEnabled) : true;
    const freeShipPromo = parseBool(settings.freeShipPromo);
    const freeShipThreshold = parseNumber(settings.freeShipThreshold);
    const whatsapp = settings.whatsapp?.trim();

    if (selectedDeliveryMethod === 'delivery' && !deliveryEnabled) {
      return res.status(400).json({ error: 'Entrega a domicílio indisponível no momento' });
    }
    if (selectedDeliveryMethod === 'pickup' && !pickupEnabled) {
      return res.status(400).json({ error: 'Retirada na loja indisponível no momento' });
    }

    if (selectedDeliveryMethod === 'delivery') {
      const missingField = REQUIRED_DELIVERY_FIELDS.find((field) => !normalizedAddress?.[field]?.trim?.());
      if (missingField) {
        return res.status(400).json({ error: 'Preencha todos os dados de entrega obrigatórios' });
      }
    }

    const productIds = items.map((i: { productId: string }) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    for (const item of items) {
      const prod = products.find((p) => p.id === item.productId);
      if (!prod) return res.status(400).json({ error: `Produto ${item.productId} não encontrado` });
      if (!prod.active) {
        return res.status(400).json({ error: `${prod.name} está desativado e não pode ser vendido no momento` });
      }
      if (prod.stock < item.quantity) {
        return res.status(400).json({ error: `Estoque insuficiente para ${prod.name}. Disponível: ${prod.stock}` });
      }
    }

    const subtotal = items.reduce((acc: number, item: { productId: string; quantity: number }) => {
      const prod = products.find((p) => p.id === item.productId)!;
      const unitPrice = isPixPayment ? getProductPricing(prod, pricingSettings).pixPrice : prod.price;
      return acc + unitPrice * item.quantity;
    }, 0);

    let appliedCouponCode: string | null = null;
    let discountAmount = 0;
    let couponFreeShipping = false;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: String(couponCode).toUpperCase() },
      });

      if (!coupon || !coupon.active) {
        return res.status(400).json({ error: 'Cupom inválido ou inativo' });
      }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Cupom expirado' });
      }
      if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
        return res.status(400).json({ error: 'Cupom esgotado' });
      }
      if (subtotal < coupon.minOrder) {
        return res.status(400).json({ error: `Pedido mínimo de R$ ${coupon.minOrder.toFixed(2)} para este cupom` });
      }

      appliedCouponCode = coupon.code;
      discountAmount = coupon.type === 'percent'
        ? (subtotal * coupon.value) / 100
        : coupon.type === 'frete'
          ? 0
          : coupon.value;
      couponFreeShipping = coupon.freeShipping || coupon.type === 'frete';
    } else if (discount) {
      discountAmount = Number(discount) || 0;
    }

    discountAmount = +Math.max(0, Math.min(subtotal, discountAmount)).toFixed(2);

    const freeShippingApplied =
      selectedDeliveryMethod === 'delivery' &&
      (freeShipPromo || subtotal >= freeShipThreshold || couponFreeShipping);

    const shippingMessage = selectedDeliveryMethod === 'pickup'
      ? 'Retirada na loja'
      : freeShippingApplied
        ? 'Frete grátis aplicado'
        : whatsapp
          ? `Valor do frete informado manualmente no WhatsApp ${whatsapp}`
          : 'Valor do frete informado manualmente pelo WhatsApp após o pedido';

    const total = +Math.max(0, subtotal - discountAmount).toFixed(2);
    const cashback = +(total * 0.05).toFixed(2);

    let customer = await prisma.customer.findUnique({ where: { email: customerEmail } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          cpf: customerCpf,
          city: normalizedAddress?.cidade,
          state: normalizedAddress?.estado,
        },
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerId: customer.id,
          customerName,
          customerEmail,
          customerPhone,
          customerCpf,
          subtotal,
          total,
          discount: discountAmount,
          cashback,
          paymentMethod: paymentMethodText,
          deliveryMethod: selectedDeliveryMethod,
          address: normalizedAddress ? {
            ...normalizedAddress,
            freeShippingApplied,
            shippingMessage,
          } : null,
          couponCode: appliedCouponCode,
          notes: shippingMessage,
          status: isPixPayment ? 'aguardando_pagamento' : 'pendente',
          items: {
            create: items.map((item: { productId: string; productName: string; quantity: number; size: string; color: string }) => {
              const prod = products.find((p) => p.id === item.productId)!;
              const productPricing = getProductPricing(prod, pricingSettings);
              const unitPrice = isPixPayment ? productPricing.pixPrice : prod.price;
              return {
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                price: unitPrice,
                pixPrice: productPricing.pixPrice,
                size: item.size,
                color: item.color,
              };
            }),
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      if (appliedCouponCode) {
        await tx.coupon.update({
          where: { code: appliedCouponCode },
          data: { uses: { increment: 1 } },
        });
      }

      return createdOrder;
    });

    res.status(201).json({
      order,
      cashback,
      shipping: {
        method: selectedDeliveryMethod,
        freeShippingApplied,
        message: shippingMessage,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: { items: true, customer: true },
    });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  } catch {
    res.status(500).json({ error: 'Erro interno' });
  }
});

export default router;

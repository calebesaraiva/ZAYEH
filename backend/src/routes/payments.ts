import { Router } from 'express';
import { prisma } from '../lib/prisma';
import {
  getMercadoPagoConfig,
  getMercadoPagoPaymentStatus,
  mapMercadoPagoStatus,
} from '../lib/mercadoPago';

const router = Router();

function getOrderPaymentMeta(order: { address: unknown }) {
  const address = order.address && typeof order.address === 'object' ? order.address as Record<string, unknown> : {};
  const payment = address.payment && typeof address.payment === 'object' ? address.payment as Record<string, unknown> : {};
  return { address, payment };
}

function getStringValue(value: unknown) {
  return typeof value === 'string' ? value : '';
}

router.post('/mercadopago/webhook', async (req, res) => {
  try {
    const config = await getMercadoPagoConfig(prisma);
    if (!config) return res.status(200).json({ ok: true });

    const payload = req.body && typeof req.body === 'object' ? req.body as Record<string, unknown> : {};
    const data = payload.data && typeof payload.data === 'object' ? payload.data as Record<string, unknown> : {};
    const paymentId = String(req.query['data.id'] || req.query.data_id || data.id || '');
    if (!paymentId) return res.status(200).json({ ok: true });

    const providerStatus = await getMercadoPagoPaymentStatus(config, paymentId);
    const orderId = providerStatus.externalReference || String(req.query.order || '');
    if (!orderId) return res.status(200).json({ ok: true });

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(200).json({ ok: true });

    const { address, payment } = getOrderPaymentMeta(order);
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: mapMercadoPagoStatus(providerStatus.status),
        address: {
          ...address,
          payment: {
            ...payment,
            provider: 'mercadopago',
            paymentId: providerStatus.paymentId,
            status: providerStatus.status,
            statusDetail: providerStatus.statusDetail || getStringValue(payment.statusDetail),
            externalReference: providerStatus.externalReference || getStringValue(payment.externalReference),
            paymentTypeId: providerStatus.paymentTypeId || getStringValue(payment.paymentTypeId),
            methodId: providerStatus.methodId || getStringValue(payment.methodId),
            paidAt: providerStatus.paidAt || getStringValue(payment.paidAt),
            lastWebhookAt: new Date().toISOString(),
          },
        },
      },
    });

    return res.json({ ok: true });
  } catch (error) {
    console.error('Erro no webhook Mercado Pago:', error);
    return res.status(500).json({ error: 'Erro ao processar webhook' });
  }
});

router.get('/mercadopago/orders/:orderId/status', async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.orderId },
      include: { items: true },
    });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    const { address, payment } = getOrderPaymentMeta(order);
    const paymentId = String(req.query.paymentId || payment.paymentId || '');
    const config = await getMercadoPagoConfig(prisma);

    if (!paymentId || !config) {
      return res.json({
        order,
        payment: payment || null,
      });
    }

    const providerStatus = await getMercadoPagoPaymentStatus(config, paymentId);
    const nextPaymentMeta = {
      ...payment,
      provider: 'mercadopago',
      paymentId: providerStatus.paymentId,
      status: providerStatus.status,
      statusDetail: providerStatus.statusDetail || getStringValue(payment.statusDetail),
      externalReference: providerStatus.externalReference || getStringValue(payment.externalReference),
      paymentTypeId: providerStatus.paymentTypeId || getStringValue(payment.paymentTypeId),
      methodId: providerStatus.methodId || getStringValue(payment.methodId),
      paidAt: providerStatus.paidAt || getStringValue(payment.paidAt),
      syncedAt: new Date().toISOString(),
    };

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: mapMercadoPagoStatus(providerStatus.status),
        address: {
          ...address,
          payment: nextPaymentMeta,
        },
      },
      include: { items: true },
    });

    return res.json({
      order: updatedOrder,
      payment: nextPaymentMeta,
    });
  } catch (error) {
    console.error('Erro ao consultar status Mercado Pago:', error);
    return res.status(500).json({ error: 'Erro ao consultar pagamento' });
  }
});

export default router;

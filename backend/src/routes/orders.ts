import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { createMercadoPagoPreference, getMercadoPagoConfig } from '../lib/mercadoPago';
import { getProductPricing, getStorePricingSettings } from '../lib/storePricing';
import { getStoreSettingsMap, parseBool, parseNumber } from '../lib/storeSettings';
import { quoteShipping } from '../lib/shipping';

const router = Router();

const REQUIRED_DELIVERY_FIELDS = ['cep', 'rua', 'num', 'bairro', 'cidade', 'estado'] as const;
const normalizeEmail = (value: unknown) => String(value ?? '').trim().toLowerCase();
const normalizeCpf = (value: unknown) => String(value ?? '').replace(/\D/g, '').trim();

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
      installments,
      shippingQuote,
    } = req.body;

    if (!customerName || !customerEmail || !items?.length || !paymentMethod) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    const normalizedCustomerEmail = normalizeEmail(customerEmail);
    const normalizedCustomerCpf = normalizeCpf(customerCpf) || undefined;

    const selectedDeliveryMethod = deliveryMethod === 'pickup' ? 'pickup' : 'delivery';
    const normalizedAddress = address && typeof address === 'object' ? address : null;
    const paymentMethodText = String(paymentMethod).trim();
    const isPixPayment = paymentMethodText.toLowerCase().includes('pix');
    const isCardPayment = paymentMethodText.toLowerCase().includes('cart');

    const [settings, pricingSettings, mercadoPagoConfig] = await Promise.all([
      getStoreSettingsMap(prisma),
      getStorePricingSettings(prisma),
      getMercadoPagoConfig(prisma),
    ]);

    const deliveryEnabled = settings.deliveryEnabled !== undefined ? parseBool(settings.deliveryEnabled) : true;
    const pickupEnabled = settings.pickupEnabled !== undefined ? parseBool(settings.pickupEnabled) : true;
    const freeShipPromo = parseBool(settings.freeShipPromo);
    const freeShipThreshold = parseNumber(settings.freeShipThreshold);
    const whatsapp = settings.whatsapp?.trim();
    const manualShippingMessage = whatsapp
      ? `Valor do frete informado manualmente no WhatsApp ${whatsapp}`
      : 'Valor do frete informado manualmente pelo WhatsApp após o pedido';
    const requestedInstallments = Math.max(1, Math.trunc(Number(installments) || 1));

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

    let calculatedShippingQuote: Awaited<ReturnType<typeof quoteShipping>> | null = null;
    let shippingAmount = 0;
    if (selectedDeliveryMethod === 'delivery' && normalizedAddress?.cep) {
      try {
        calculatedShippingQuote = await quoteShipping(prisma, {
          cepDestino: normalizedAddress.cep,
          subtotal,
          serviceCode: shippingQuote?.serviceCode,
          freeShipping: freeShippingApplied,
          cidade: normalizedAddress.cidade,
          estado: normalizedAddress.estado,
        });
        shippingAmount = calculatedShippingQuote.selected.price;
      } catch {
        calculatedShippingQuote = null;
      }
    }

    if (selectedDeliveryMethod === 'delivery' && !freeShippingApplied && !calculatedShippingQuote) {
      return res.status(400).json({
        error: 'Informe um CEP valido e calcule o frete antes de ir para o pagamento. Para Imperatriz/MA o frete local e R$ 10,00.',
      });
    }

    const shippingMessage = selectedDeliveryMethod === 'pickup'
      ? 'Retirada na loja'
      : freeShippingApplied || calculatedShippingQuote?.freeShippingApplied
        ? 'Frete grátis aplicado'
        : calculatedShippingQuote
          ? `Frete ${calculatedShippingQuote.selected.serviceName}: R$ ${calculatedShippingQuote.selected.price.toFixed(2).replace('.', ',')}${calculatedShippingQuote.selected.deadlineText ? ` · ${calculatedShippingQuote.selected.deadlineText}` : ''}`
        : manualShippingMessage;

    const total = +Math.max(0, subtotal - discountAmount + shippingAmount).toFixed(2);
    const cashback = +(total * 0.05).toFixed(2);
    const paymentMethodLabel = isPixPayment
      ? 'Mercado Pago PIX'
      : isCardPayment
        ? `Mercado Pago Cartão ${requestedInstallments}x`
        : paymentMethodText;

    let customer = await prisma.customer.findFirst({
      where: {
        OR: [
          { email: normalizedCustomerEmail },
          ...(normalizedCustomerCpf ? [{ cpf: normalizedCustomerCpf }] : []),
        ],
      },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          email: normalizedCustomerEmail,
          phone: customerPhone,
          cpf: normalizedCustomerCpf,
          city: normalizedAddress?.cidade,
          state: normalizedAddress?.estado,
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: customerName,
          phone: customerPhone,
          city: normalizedAddress?.cidade ?? customer.city,
          state: normalizedAddress?.estado ?? customer.state,
          ...(customer.email === normalizedCustomerEmail ? { email: normalizedCustomerEmail } : {}),
          ...(!customer.cpf && normalizedCustomerCpf ? { cpf: normalizedCustomerCpf } : {}),
        },
      });
    }

    let shouldCreateCheckout = false;
    let order = await prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          customerId: customer.id,
          customerName,
          customerEmail: normalizedCustomerEmail,
          customerPhone,
          customerCpf: normalizedCustomerCpf,
          subtotal,
          total,
          discount: discountAmount,
          cashback,
          paymentMethod: paymentMethodLabel,
          deliveryMethod: selectedDeliveryMethod,
          address: {
            ...(normalizedAddress || {}),
            freeShippingApplied,
            shippingMessage,
            shippingAmount,
            shippingQuote: calculatedShippingQuote ? {
              provider: calculatedShippingQuote.provider,
              serviceCode: calculatedShippingQuote.selected.serviceCode,
              serviceName: calculatedShippingQuote.selected.serviceName,
              price: calculatedShippingQuote.selected.price,
              originalPrice: calculatedShippingQuote.selected.originalPrice,
              deadlineDays: calculatedShippingQuote.selected.deadlineDays,
              deadlineText: calculatedShippingQuote.selected.deadlineText,
              cepOrigem: calculatedShippingQuote.originCep,
              cepDestino: calculatedShippingQuote.destinationCep,
            } : null,
            payment: {
              provider: mercadoPagoConfig ? 'mercadopago' : 'manual',
              method: isPixPayment ? 'PIX' : isCardPayment ? 'CREDIT_CARD' : paymentMethodText,
              installments: requestedInstallments,
              checkoutEligible: mercadoPagoConfig ? (selectedDeliveryMethod === 'pickup' || freeShippingApplied || calculatedShippingQuote !== null) : false,
            },
          },
          couponCode: appliedCouponCode,
          notes: shippingMessage,
          status: isPixPayment || isCardPayment ? 'aguardando_pagamento' : 'pendente',
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

      shouldCreateCheckout = Boolean(
        mercadoPagoConfig &&
        (isPixPayment || isCardPayment) &&
        (selectedDeliveryMethod === 'pickup' || freeShippingApplied || calculatedShippingQuote !== null),
      );

      return createdOrder;
    });

    let payment:
      | {
          provider: 'mercadopago';
          method: 'PIX' | 'CREDIT_CARD';
          preferenceId: string;
          checkoutUrl: string;
        }
      | {
          provider: 'manual';
          reason: string;
        }
      | null = null;

    if ((isPixPayment || isCardPayment) && !mercadoPagoConfig) {
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'pendente',
          notes: `${shippingMessage} | Mercado Pago ainda não configurado.`,
        },
        include: { items: true },
      });
      payment = {
        provider: 'manual',
        reason: 'Pagamento online temporariamente indisponível. A loja continuará o atendimento manualmente.',
      };
    }

    if ((isPixPayment || isCardPayment) && !shouldCreateCheckout) {
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'pendente',
          notes: `${shippingMessage} | Pagamento online liberado após confirmação manual do frete.`,
        },
        include: { items: true },
      });
      payment = {
        provider: 'manual',
        reason: selectedDeliveryMethod === 'delivery' && !freeShippingApplied
          ? 'Pagamento online liberado após calcular o frete automático ou confirmar o frete com a loja.'
          : 'Pagamento online indisponível para este pedido.',
      };
    }

    if (shouldCreateCheckout && mercadoPagoConfig) {
      try {
        const checkout = await createMercadoPagoPreference(mercadoPagoConfig, {
          orderId: order.id,
          customerName,
          customerEmail: normalizedCustomerEmail,
          customerPhone,
          customerCpf: normalizedCustomerCpf,
          discountAmount,
          shippingAmount,
          shippingLabel: calculatedShippingQuote ? `Frete ${calculatedShippingQuote.selected.serviceName}` : undefined,
          paymentMethod: isPixPayment ? 'pix' : 'credit_card',
          items: items.map((item: { productId: string; productName: string; quantity: number }) => {
            const prod = products.find((p) => p.id === item.productId)!;
            const unitPrice = isPixPayment ? getProductPricing(prod, pricingSettings).pixPrice : prod.price;
            return {
              referenceId: item.productId,
              name: item.productName,
              quantity: item.quantity,
              unitAmount: unitPrice,
            };
          }),
        });

        const addressData = order.address && typeof order.address === 'object'
          ? order.address as Record<string, unknown>
          : {};
        const previousPayment = addressData.payment && typeof addressData.payment === 'object'
          ? addressData.payment as Record<string, unknown>
          : {};

        order = await prisma.order.update({
          where: { id: order.id },
          data: {
            address: {
              ...addressData,
              payment: {
                ...previousPayment,
                provider: 'mercadopago',
                method: isPixPayment ? 'PIX' : 'CREDIT_CARD',
                preferenceId: checkout.preferenceId,
                checkoutUrl: checkout.checkoutUrl,
                status: 'pending',
                createdAt: new Date().toISOString(),
              },
            },
          },
          include: { items: true },
        });

        payment = {
          provider: 'mercadopago',
          method: isPixPayment ? 'PIX' : 'CREDIT_CARD',
          preferenceId: checkout.preferenceId,
          checkoutUrl: checkout.checkoutUrl,
        };
      } catch (paymentError) {
        const message = paymentError instanceof Error ? paymentError.message : 'Falha ao iniciar pagamento Mercado Pago';
        order = await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'pendente',
            notes: `Falha ao iniciar checkout Mercado Pago: ${message}. Atendimento seguirá manualmente.`,
          },
          include: { items: true },
        });
        payment = {
          provider: 'manual',
          reason: `Pagamento online indisponível no momento: ${message}. A loja seguirá o atendimento manualmente.`,
        };
      }
    }

    res.status(201).json({
      order,
      cashback,
      payment,
      shipping: {
        method: selectedDeliveryMethod,
        freeShippingApplied,
        amount: shippingAmount,
        quote: calculatedShippingQuote,
        message: shippingMessage,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

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

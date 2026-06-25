import type { PrismaClient } from '../generated/prisma';
import { getStoreSettingsMap, parseBool, parseNumber } from './storeSettings';

type MercadoPagoEnvironment = 'production' | 'sandbox';
type JsonObject = Record<string, unknown>;

export interface MercadoPagoConfig {
  enabled: boolean;
  accessToken: string;
  webhookSecret: string;
  environment: MercadoPagoEnvironment;
  storeName: string;
  maxInstallments: number;
  interestFreeInstallments: number;
  webhookUrl: string;
  returnUrl: string;
}

export interface MercadoPagoPreferenceResult {
  preferenceId: string;
  checkoutUrl: string;
  raw: unknown;
}

export interface MercadoPagoPaymentStatus {
  paymentId: string;
  status: string;
  statusDetail?: string;
  externalReference?: string;
  paymentTypeId?: string;
  methodId?: string;
  paidAt?: string;
  raw: unknown;
}

function getString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function cleanPhone(value?: string) {
  return String(value || '').replace(/\D/g, '');
}

function cleanTaxId(value?: string) {
  return String(value || '').replace(/\D/g, '');
}

async function mercadoPagoRequest<T>(config: MercadoPagoConfig, path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${config.accessToken}`);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  const res = await fetch(`https://api.mercadopago.com${path}`, {
    ...init,
    headers,
  });

  const text = await res.text();
  const data: unknown = (() => {
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return text;
    }
  })();

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in (data as JsonObject) && typeof (data as JsonObject).message === 'string'
        ? String((data as JsonObject).message)
        : '') ||
      (typeof data === 'string' ? data : '') ||
      `Erro Mercado Pago ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

export async function getMercadoPagoConfig(prisma: PrismaClient): Promise<MercadoPagoConfig | null> {
  const settings = await getStoreSettingsMap(prisma);
  const accessToken = getString(process.env.MERCADOPAGO_ACCESS_TOKEN || settings.mercadopagoAccessToken).trim();
  const webhookSecret = getString(process.env.MERCADOPAGO_WEBHOOK_SECRET || settings.mercadopagoWebhookSecret).trim();
  const enabled = parseBool(settings.mercadopagoEnabled, true);

  if (!enabled || !accessToken) return null;

  const domain = getString(process.env.PUBLIC_SITE_URL || settings.publicSiteUrl || 'https://zayeh.com.br').replace(/\/+$/, '');

  return {
    enabled,
    accessToken,
    webhookSecret,
    environment: settings.mercadopagoEnvironment === 'sandbox' ? 'sandbox' : 'production',
    storeName: getString(settings.storeDisplayName || 'ZAYEH').slice(0, 22) || 'ZAYEH',
    maxInstallments: Math.max(1, Math.trunc(parseNumber(settings.maxInstallments, 12))),
    interestFreeInstallments: Math.max(1, Math.trunc(parseNumber(settings.interestFreeInstallments, 3))),
    webhookUrl: `${domain}/api/payments/mercadopago/webhook`,
    returnUrl: `${domain}/pagamento/retorno`,
  };
}

export function mapMercadoPagoStatus(status: string) {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'authorized':
      return 'pago';
    case 'rejected':
    case 'cancelled':
    case 'refunded':
    case 'charged_back':
      return 'cancelado';
    case 'pending':
    case 'in_process':
    case 'in_mediation':
    default:
      return 'aguardando_pagamento';
  }
}

export async function createMercadoPagoPreference(
  config: MercadoPagoConfig,
  payload: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    customerCpf?: string;
    items: { name: string; quantity: number; unitAmount: number; referenceId: string }[];
    discountAmount: number;
    paymentMethod: 'pix' | 'credit_card';
  },
) {
  const phone = cleanPhone(payload.customerPhone);
  const taxId = cleanTaxId(payload.customerCpf);
  const response = await mercadoPagoRequest<JsonObject>(config, '/checkout/preferences', {
    method: 'POST',
    body: JSON.stringify({
      external_reference: payload.orderId,
      notification_url: `${config.webhookUrl}?order=${payload.orderId}`,
      back_urls: {
        success: `${config.returnUrl}?order=${payload.orderId}`,
        failure: `${config.returnUrl}?order=${payload.orderId}`,
        pending: `${config.returnUrl}?order=${payload.orderId}`,
      },
      auto_return: 'approved',
      statement_descriptor: config.storeName,
      payer: {
        name: payload.customerName,
        email: payload.customerEmail,
        identification: taxId
          ? {
              type: 'CPF',
              number: taxId,
            }
          : undefined,
        phone: phone
          ? {
              area_code: phone.slice(0, 2),
              number: phone.slice(2),
            }
          : undefined,
      },
      items: payload.items.map((item) => ({
        id: item.referenceId,
        title: item.name,
        quantity: item.quantity,
        currency_id: 'BRL',
        unit_price: Number(item.unitAmount.toFixed(2)),
      })),
      payment_methods: {
        installments: config.maxInstallments,
        default_installments: 1,
        default_payment_method_id: payload.paymentMethod === 'pix' ? 'pix' : undefined,
        excluded_payment_types:
          payload.paymentMethod === 'pix'
            ? [{ id: 'credit_card' }, { id: 'debit_card' }, { id: 'ticket' }, { id: 'atm' }]
            : [{ id: 'ticket' }, { id: 'atm' }],
      },
      metadata: {
        order_id: payload.orderId,
        discount_amount: payload.discountAmount,
        interest_free_installments: config.interestFreeInstallments,
      },
    }),
  });

  const preferenceId = getString(response.id);
  const initPoint =
    config.environment === 'sandbox'
      ? getString(response.sandbox_init_point) || getString(response.init_point)
      : getString(response.init_point) || getString(response.sandbox_init_point);

  if (!preferenceId || !initPoint) {
    throw new Error('Mercado Pago não retornou o link do checkout.');
  }

  return {
    preferenceId,
    checkoutUrl: initPoint,
    raw: response,
  } satisfies MercadoPagoPreferenceResult;
}

export async function getMercadoPagoPaymentStatus(config: MercadoPagoConfig, paymentId: string) {
  const response = await mercadoPagoRequest<JsonObject>(config, `/v1/payments/${paymentId}`, {
    method: 'GET',
  });

  return {
    paymentId: getString(response.id) || paymentId,
    status: getString(response.status),
    statusDetail: getString(response.status_detail) || undefined,
    externalReference: getString(response.external_reference) || undefined,
    paymentTypeId: getString(response.payment_type_id) || undefined,
    methodId: getString(response.payment_method_id) || undefined,
    paidAt: getString(response.date_approved) || getString(response.date_last_updated) || undefined,
    raw: response,
  } satisfies MercadoPagoPaymentStatus;
}

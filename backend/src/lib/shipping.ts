import type { PrismaClient } from '../generated/prisma';
import { getStoreSettingsMap, parseBool, parseNumber, type StoreSettingsMap } from './storeSettings';

type JsonObject = Record<string, unknown>;

export interface ShippingQuoteOption {
  serviceCode: string;
  serviceName: string;
  price: number;
  originalPrice: number;
  deadlineDays?: number;
  deadlineText?: string;
}

export interface ShippingQuoteResult {
  provider: 'correios' | 'local';
  originCep: string;
  destinationCep: string;
  freeShippingApplied: boolean;
  options: ShippingQuoteOption[];
  selected: ShippingQuoteOption;
}

export class ShippingQuoteError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

const SERVICE_NAMES: Record<string, string> = {
  '03220': 'SEDEX',
  '03298': 'PAC',
  '04014': 'SEDEX',
  '04510': 'PAC',
};

function onlyDigits(value: unknown) {
  return String(value ?? '').replace(/\D/g, '');
}

function normalizeText(value: unknown) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function isImperatrizDelivery(city: unknown, state: unknown) {
  return normalizeText(city) === 'imperatriz' && normalizeText(state) === 'ma';
}

function parseMoney(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return 0;
  const normalized = value.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3})/g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getNested(data: unknown, keys: string[]) {
  if (!data || typeof data !== 'object') return undefined;
  const obj = data as JsonObject;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function getConfig(settings: StoreSettingsMap) {
  const token = String(process.env.CORREIOS_TOKEN || settings.correiosToken || '').trim();
  const originCep = onlyDigits(process.env.CORREIOS_CEP_ORIGEM || settings.correiosCepOrigem || settings.storeCep || '65900000');
  const serviceCodes = String(process.env.CORREIOS_SERVICE_CODES || settings.correiosServiceCodes || '03298,03220')
    .split(',')
    .map((code) => code.trim())
    .filter(Boolean);

  return {
    enabled: parseBool(settings.correiosEnabled, true),
    token,
    originCep,
    serviceCodes: serviceCodes.length ? serviceCodes : ['03298', '03220'],
    priceBaseUrl: String(process.env.CORREIOS_PRECO_BASE_URL || 'https://api.correios.com.br/preco/v1').replace(/\/+$/, ''),
    deadlineBaseUrl: String(process.env.CORREIOS_PRAZO_BASE_URL || 'https://api.correios.com.br/prazo/v1').replace(/\/+$/, ''),
    weightGrams: Math.max(1, parseNumber(process.env.CORREIOS_PACKAGE_WEIGHT_GRAMS || settings.correiosPesoGramas, 500)),
    lengthCm: Math.max(16, parseNumber(process.env.CORREIOS_PACKAGE_LENGTH_CM || settings.correiosComprimentoCm, 24)),
    widthCm: Math.max(11, parseNumber(process.env.CORREIOS_PACKAGE_WIDTH_CM || settings.correiosLarguraCm, 18)),
    heightCm: Math.max(2, parseNumber(process.env.CORREIOS_PACKAGE_HEIGHT_CM || settings.correiosAlturaCm, 8)),
    handlingFee: Math.max(0, parseNumber(process.env.SHIPPING_HANDLING_FEE || settings.shippingHandlingFee, 0)),
    freeShipPromo: parseBool(settings.freeShipPromo),
    freeShipThreshold: parseNumber(settings.freeShipThreshold, 599.99),
  };
}

async function correiosGet(url: URL, token: string) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
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
    const message = data && typeof data === 'object'
      ? String(getNested(data, ['msg', 'message', 'erro', 'descricao']) || '')
      : String(data || '');
    throw new ShippingQuoteError(message || `Correios respondeu ${res.status}`, res.status);
  }
  return Array.isArray(data) ? data[0] : data;
}

async function quoteService(config: ReturnType<typeof getConfig>, destinationCep: string, serviceCode: string): Promise<ShippingQuoteOption> {
  const priceUrl = new URL(`${config.priceBaseUrl}/nacional/${encodeURIComponent(serviceCode)}`);
  priceUrl.searchParams.set('cepOrigem', config.originCep);
  priceUrl.searchParams.set('cepDestino', destinationCep);
  priceUrl.searchParams.set('psObjeto', String(config.weightGrams));
  priceUrl.searchParams.set('tpObjeto', '2');
  priceUrl.searchParams.set('comprimento', String(config.lengthCm));
  priceUrl.searchParams.set('largura', String(config.widthCm));
  priceUrl.searchParams.set('altura', String(config.heightCm));

  const priceData = await correiosGet(priceUrl, config.token);
  const rawPrice = getNested(priceData, ['pcFinal', 'precoFinal', 'valorFinal', 'valor', 'vlPreco', 'preco']);
  const price = parseMoney(rawPrice) + config.handlingFee;

  if (!price || price <= 0) {
    throw new ShippingQuoteError('Correios não retornou valor de frete para este CEP.', 422);
  }

  let deadlineDays: number | undefined;
  try {
    const deadlineUrl = new URL(`${config.deadlineBaseUrl}/nacional/${encodeURIComponent(serviceCode)}`);
    deadlineUrl.searchParams.set('cepOrigem', config.originCep);
    deadlineUrl.searchParams.set('cepDestino', destinationCep);
    const deadlineData = await correiosGet(deadlineUrl, config.token);
    const rawDeadline = getNested(deadlineData, ['prazoEntrega', 'prazo', 'dias', 'nuPrazoEntrega']);
    const parsed = Number(rawDeadline);
    if (Number.isFinite(parsed) && parsed > 0) deadlineDays = parsed;
  } catch {
    // Preco e prazo sao APIs separadas; se o prazo falhar, ainda exibimos o valor.
  }

  return {
    serviceCode,
    serviceName: SERVICE_NAMES[serviceCode] || `Correios ${serviceCode}`,
    price: +price.toFixed(2),
    originalPrice: +price.toFixed(2),
    deadlineDays,
    deadlineText: deadlineDays ? `${deadlineDays} dia${deadlineDays > 1 ? 's' : ''} uteis` : undefined,
  } satisfies ShippingQuoteOption;
}

export async function quoteShipping(
  prisma: PrismaClient,
  payload: { cepDestino: unknown; subtotal?: unknown; serviceCode?: unknown; freeShipping?: boolean; cidade?: unknown; estado?: unknown },
): Promise<ShippingQuoteResult> {
  const settings = await getStoreSettingsMap(prisma);
  const config = getConfig(settings);
  const destinationCep = onlyDigits(payload.cepDestino);
  const subtotal = parseNumber(String(payload.subtotal ?? 0), 0);
  const preferredServiceCode = String(payload.serviceCode || '').trim();
  const freeShippingApplied = Boolean(payload.freeShipping) || config.freeShipPromo || subtotal >= config.freeShipThreshold;

  if (destinationCep.length !== 8) throw new ShippingQuoteError('Informe um CEP valido com 8 digitos.', 400);

  if (isImperatrizDelivery(payload.cidade, payload.estado)) {
    const localPrice = freeShippingApplied ? 0 : 10;
    const option = {
      serviceCode: 'LOCAL-IMP',
      serviceName: 'Entrega local Imperatriz',
      price: localPrice,
      originalPrice: 10,
      deadlineDays: 1,
      deadlineText: 'ate 1 dia util',
    } satisfies ShippingQuoteOption;

    return {
      provider: 'local',
      originCep: config.originCep,
      destinationCep,
      freeShippingApplied,
      options: [option],
      selected: option,
    };
  }

  if (!config.enabled) throw new ShippingQuoteError('Calculo automatico de frete esta desativado.', 503);
  if (!config.token) throw new ShippingQuoteError('Token dos Correios nao configurado. Configure no painel ou na VPS para liberar frete automatico.', 503);
  if (config.originCep.length !== 8) throw new ShippingQuoteError('CEP de origem dos Correios invalido.', 500);

  const quoted = await Promise.allSettled(config.serviceCodes.map((code) => quoteService(config, destinationCep, code)));
  const options = quoted
    .filter((result): result is PromiseFulfilledResult<ShippingQuoteOption> => result.status === 'fulfilled')
    .map((result) => result.value)
    .sort((a, b) => a.price - b.price);

  if (!options.length) {
    const firstError = quoted.find((result): result is PromiseRejectedResult => result.status === 'rejected')?.reason;
    const message = firstError instanceof Error ? firstError.message : 'Nao foi possivel calcular o frete pelos Correios.';
    throw new ShippingQuoteError(message, firstError instanceof ShippingQuoteError ? firstError.status : 502);
  }

  const selectedBase = options.find((option) => option.serviceCode === preferredServiceCode) || options[0];
  const normalizedOptions = options.map((option) => ({
    ...option,
    price: freeShippingApplied ? 0 : option.originalPrice,
  }));
  const selected = normalizedOptions.find((option) => option.serviceCode === selectedBase.serviceCode) || normalizedOptions[0];

  return {
    provider: 'correios',
    originCep: config.originCep,
    destinationCep,
    freeShippingApplied,
    options: normalizedOptions,
    selected,
  };
}

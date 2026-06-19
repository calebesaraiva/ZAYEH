import { useEffect, useState } from 'react';
import { api } from './api';

export interface StoreSettings {
  whatsapp: string;
  storeAddress: string;
  storeHours: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  whatsapp: '',
  storeAddress: '',
  storeHours: '',
};

let cachedSettings: StoreSettings | null = null;
let inflightSettings: Promise<StoreSettings> | null = null;

export function resolveStoreSettings(raw?: Record<string, string> | null): StoreSettings {
  return {
    whatsapp: raw?.whatsapp?.trim() ?? '',
    storeAddress: raw?.storeAddress?.trim() ?? '',
    storeHours: raw?.storeHours?.trim() ?? '',
  };
}

async function loadStoreSettings() {
  if (cachedSettings) return cachedSettings;
  if (!inflightSettings) {
    inflightSettings = api.settings.get()
      .then((raw) => {
        cachedSettings = resolveStoreSettings(raw);
        return cachedSettings;
      })
      .catch(() => DEFAULT_SETTINGS)
      .finally(() => {
        inflightSettings = null;
      });
  }
  return inflightSettings;
}

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(cachedSettings ?? DEFAULT_SETTINGS);

  useEffect(() => {
    let active = true;
    void loadStoreSettings().then((loaded) => {
      if (active) setSettings(loaded);
    });
    return () => {
      active = false;
    };
  }, []);

  return settings;
}

export function normalizePhoneDigits(value?: string) {
  return (value ?? '').replace(/\D/g, '');
}

export function buildWhatsAppLink(phone?: string, text?: string) {
  const digits = normalizePhoneDigits(phone);
  if (!digits) return '';
  const intl = digits.startsWith('55') ? digits : `55${digits}`;
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${intl}${query}`;
}

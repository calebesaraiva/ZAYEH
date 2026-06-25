import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChevronRight, CreditCard, Lock,
  CheckCircle, ChevronLeft, Zap, Coins,
  Tag, Loader2, Store, MapPin, Clock,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { api, type ShippingQuoteResponse } from '../lib/api';
import { getProductPricing, resolveStorePricingSettings } from '../lib/storePricing';

const STEPS = ['Dados', 'Pagamento'];
type PayMethod = 'cartao' | 'pix';
type DeliveryMethod = 'delivery' | 'pickup';

const inp: React.CSSProperties = {
  width: '100%', background: '#fffdf7',
  border: '1px solid rgba(12,46,42,0.16)',
  borderRadius: 10, padding: '13px 14px',
  color: '#0b2f2b', fontSize: 14, fontFamily: 'inherit', outline: 'none',
  transition: 'border-color 0.2s',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 800, color: '#596760',
  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
};
const focusIn = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.target.style.borderColor = 'rgba(184,132,44,0.48)');
const focusOut = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) =>
  (e.target.style.borderColor = 'rgba(12,46,42,0.16)');

export default function CheckoutPage() {
  const { cart, clearCart, showToast } = useStore();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState<PayMethod>('cartao');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('delivery');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponFreeShipping, setCouponFreeShipping] = useState(false);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [redirectingCheckout, setRedirectingCheckout] = useState('');
  const [orderId, setOrderId] = useState('');
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [shippingMessage, setShippingMessage] = useState('Valor do frete informado manualmente pelo WhatsApp após o pedido.');
  const [shippingQuote, setShippingQuote] = useState<ShippingQuoteResponse | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');
  const [settings, setSettings] = useState<Record<string, string>>({});

  const deliveryEnabled = settings.deliveryEnabled !== 'false';
  const pickupEnabled = settings.pickupEnabled !== 'false';
  const freeShipPromo = settings.freeShipPromo === 'true';
  const pricingSettings = resolveStorePricingSettings(settings);
  const freeShipThreshold = pricingSettings.freeShipThreshold;
  const whatsapp = settings.whatsapp?.trim();
  const storeAddress = settings.storeAddress || 'ZAYEH - Imperatriz, MA';
  const storeHours = settings.storeHours || 'Seg-Sab: 9h-19h · Dom: 10h-14h';
  const maxInstallments = pricingSettings.maxInstallments;
  const interestFreeInstallments = pricingSettings.interestFreeInstallments;
  const pixEnabled = settings.pixEnabled !== 'false';
  const cardEnabled = settings.cardEnabled !== 'false';
  const resolvedPayMethod: PayMethod =
    !cardEnabled && pixEnabled ? 'pix' :
    !pixEnabled && cardEnabled ? 'cartao' :
    payMethod;
  const subtotal = cart.reduce((a, i) => a + i.product.price * i.quantity, 0);
  const pixTotal = cart.reduce((a, i) => a + getProductPricing(i.product, pricingSettings).pixPrice * i.quantity, 0);
  const pixDiscount = subtotal - pixTotal;
  const baseTotal = resolvedPayMethod === 'pix' ? pixTotal : subtotal;

  const freeShippingApplied =
    deliveryMethod === 'delivery' &&
    (freeShipPromo || subtotal >= freeShipThreshold || couponFreeShipping || shippingQuote?.freeShippingApplied);
  const shippingAmount = deliveryMethod === 'delivery' && !freeShippingApplied ? (shippingQuote?.selected.price || 0) : 0;
  const total = Math.max(0, baseTotal - couponDiscount + shippingAmount);
  const cashback = Math.max(0, total) * 0.05;

  const [form, setForm] = useState({
    nome: '', cpf: '', email: '', tel: '',
    cep: '', rua: '', num: '', comp: '', bairro: '', cidade: '', estado: '',
    card_num: '', card_name: '', card_exp: '', card_cvv: '', parcelas: '1',
  });
  const cepDigits = form.cep.replace(/\D/g, '');

  useEffect(() => {
    api.settings.get()
      .then((data) => {
        setSettings(data);
        const allowDelivery = data.deliveryEnabled !== 'false';
        const allowPickup = data.pickupEnabled !== 'false';
        if (!allowDelivery && allowPickup) setDeliveryMethod('pickup');
        if (!allowPickup && allowDelivery) setDeliveryMethod('delivery');
      })
      .catch(() => {
        // Mantem os defaults caso o backend de configuracoes nao responda.
      });
  }, []);

  useEffect(() => {
    if (deliveryMethod !== 'delivery') {
      setShippingQuote(null);
      setShippingError('');
      setShippingLoading(false);
      return;
    }
    if (cepDigits.length !== 8) {
      setShippingQuote(null);
      setShippingError('');
      setShippingLoading(false);
      return;
    }

    let cancelled = false;
    setShippingLoading(true);
    setShippingError('');
    const timer = window.setTimeout(() => {
      api.shipping.quote({
        cepDestino: cepDigits,
        subtotal,
        serviceCode: shippingQuote?.selected.serviceCode,
        freeShipping: freeShipPromo || subtotal >= freeShipThreshold || couponFreeShipping,
      })
        .then((quote) => {
          if (cancelled) return;
          setShippingQuote(quote);
          setShippingError('');
        })
        .catch((error) => {
          if (cancelled) return;
          setShippingQuote(null);
          setShippingError(error instanceof Error ? error.message : 'Nao foi possivel calcular o frete.');
        })
        .finally(() => {
          if (!cancelled) setShippingLoading(false);
        });
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [cepDigits, deliveryMethod, subtotal, freeShipPromo, freeShipThreshold, couponFreeShipping]);

  useEffect(() => {
    if (!redirectingCheckout) return;
    window.location.assign(redirectingCheckout);
  }, [redirectingCheckout]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const applyCoupon = async () => {
    const code = coupon.trim();
    if (!code) return;
    try {
      const orderBaseTotal = resolvedPayMethod === 'pix' ? pixTotal : subtotal;
      const result = await api.coupons.validate(code, orderBaseTotal);
      setCouponDiscount(result.discount);
      setCouponApplied(true);
      setCouponFreeShipping(result.freeShipping);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Cupom inválido', 'error');
    }
  };

  const resetCoupon = () => {
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponFreeShipping(false);
    setCoupon('');
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.nome.trim() || !form.email.trim() || !form.tel.trim()) {
        showToast('Preencha nome, e-mail e telefone.', 'error');
        return false;
      }
      if (deliveryMethod === 'delivery') {
        const required = [form.cep, form.rua, form.num, form.bairro, form.cidade, form.estado];
        if (required.some((value) => !value.trim())) {
          showToast('Preencha todos os dados de entrega.', 'error');
          return false;
        }
        if (cepDigits.length === 8 && shippingLoading) {
          showToast('Aguarde o calculo do frete.', 'error');
          return false;
        }
      }
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (step === 1) {
      void handleFinish();
      return;
    }
    if (step < 2) setStep((s) => s + 1);
    else void handleFinish();
  };

  const prev = () => step > 0 && setStep((s) => s - 1);

  const handleFinish = async () => {
    if (!validateStep()) return;
    setSubmitting(true);
    try {
      const items = cart.map((i) => {
        const pricing = getProductPricing(i.product, pricingSettings);
        return {
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: resolvedPayMethod === 'pix' ? pricing.pixPrice : i.product.price,
          pixPrice: pricing.pixPrice,
          size: i.size,
          color: i.color,
        };
      });

      const { order, shipping, payment } = await api.orders.create({
        customerName: form.nome,
        customerEmail: form.email,
        customerPhone: form.tel,
        customerCpf: form.cpf,
        items,
        paymentMethod: resolvedPayMethod === 'cartao' ? `Cartão ${form.parcelas}x` : 'PIX',
        installments: resolvedPayMethod === 'cartao' ? Number(form.parcelas) : 1,
        deliveryMethod,
        address: deliveryMethod === 'delivery' ? {
          cep: form.cep,
          rua: form.rua,
          num: form.num,
          comp: form.comp,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
        } : undefined,
        shippingQuote: shippingQuote?.selected
          ? {
              serviceCode: shippingQuote.selected.serviceCode,
              serviceName: shippingQuote.selected.serviceName,
              price: shippingQuote.selected.price,
              deadlineDays: shippingQuote.selected.deadlineDays,
              deadlineText: shippingQuote.selected.deadlineText,
            }
          : undefined,
        couponCode: couponApplied ? coupon.toUpperCase() : undefined,
        discount: couponDiscount,
      });

      if (payment?.provider === 'mercadopago' && payment.checkoutUrl) {
        clearCart();
        setRedirectingCheckout(payment.checkoutUrl);
        return;
      }

      setOrderId(order.id);
      setShippingMessage(payment?.reason || shipping.message);
      clearCart();
      setDone(true);
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Erro ao finalizar pedido. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', minHeight: '60vh' }}>
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: 420 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', border: '2px solid #22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <CheckCircle size={32} style={{ color: '#22C55E' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Pedido confirmado!</h2>
        {orderId && <p style={{ fontSize: 11, color: '#d8a84a', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 700 }}>#{orderId.slice(-8).toUpperCase()}</p>}
        <p style={{ color: '#555', marginBottom: 20, lineHeight: 1.6 }}>
          {deliveryMethod === 'delivery' ? shippingMessage : 'Seu pedido ficou registrado com retirada na loja.'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 10, background: 'rgba(216,168,74,0.08)', border: '1px solid rgba(216,168,74,0.2)', marginBottom: 28 }}>
          <Coins size={15} style={{ color: '#d8a84a' }} />
          <p style={{ fontSize: 13, color: '#d8a84a', fontWeight: 700 }}>R$ {cashback.toFixed(2).replace('.', ',')} de cashback na sua carteira!</p>
        </div>
        <Link to="/" className="btn-gradient no-underline" style={{ padding: '13px 32px', borderRadius: 10, fontSize: 13, letterSpacing: '0.06em' }}>
          CONTINUAR COMPRANDO
        </Link>
      </motion.div>
    </div>
  );

  if (redirectingCheckout) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', maxWidth: 420 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(216,168,74,0.12)', border: '2px solid rgba(216,168,74,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Loader2 size={30} style={{ color: '#d8a84a', animation: 'spin 1s linear infinite' }} />
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Redirecionando para o pagamento</h2>
        <p style={{ color: '#888', lineHeight: 1.7 }}>
          Você será levado ao checkout seguro do Mercado Pago para concluir o pedido.
        </p>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', minHeight: '50vh', textAlign: 'center' }}>
      <p style={{ fontSize: 48, marginBottom: 16, opacity: 0.1 }}>🛍️</p>
      <p style={{ fontWeight: 600, color: '#555', marginBottom: 20 }}>Sua sacola está vazia</p>
      <Link to="/" className="btn-gradient no-underline" style={{ padding: '12px 28px', borderRadius: 10, fontSize: 13 }}>Voltar para a loja</Link>
    </div>
  );

  const deliverySummary = deliveryMethod === 'pickup'
    ? 'Retirada · Gratis'
    : freeShippingApplied
      ? 'Frete gratis'
      : shippingQuote
        ? `R$ ${shippingAmount.toFixed(2).replace('.', ',')}`
        : shippingLoading
          ? 'Calculando...'
          : 'A calcular';

  const Stepper = () => (
    <div className="checkout-stepper-shell">
      <div className="checkout-stepper">
        {STEPS.map((s, i) => {
          const doneStep = i < step;
          const active = i === step;
          const stateClass = active ? 'active' : doneStep ? 'done' : 'upcoming';
          return (
            <div key={s} className={`checkout-step ${stateClass}`}>
              <div className="checkout-step-content">
                <motion.button
                  type="button"
                  aria-label={`Etapa ${i + 1}: ${s}`}
                  onClick={() => doneStep && setStep(i)}
                  whileHover={doneStep ? { scale: 1.06, y: -1 } : {}}
                  transition={{ duration: 0.2 }}
                  className="checkout-step-dot"
                  style={{ cursor: doneStep ? 'pointer' : 'default' }}
                >
                  {doneStep ? <CheckCircle size={18} /> : <span>{i + 1}</span>}
                </motion.button>
                <span className="checkout-step-label">
                  {s}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className="checkout-step-line" aria-hidden="true">
                  <motion.div animate={{ width: doneStep ? '100%' : '0%' }} transition={{ duration: 0.4, ease: 'easeInOut' }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const StepForm = () => (
    <AnimatePresence mode="wait">
      <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
        {step === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="checkout-grid">
            <div style={{ gridColumn: 'span 2' }} className="checkout-full">
              <label style={lbl}>Nome completo</label>
              <input style={inp} value={form.nome} onChange={set('nome')} placeholder="João Silva" onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <label style={lbl}>CPF</label>
              <input style={inp} value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" maxLength={14} onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div>
              <label style={lbl}>Telefone</label>
              <input style={inp} value={form.tel} onChange={set('tel')} placeholder="(99) 99999-9999" onFocus={focusIn} onBlur={focusOut} />
            </div>
            <div style={{ gridColumn: 'span 2' }} className="checkout-full">
              <label style={lbl}>E-mail</label>
              <input type="email" style={inp} value={form.email} onChange={set('email')} placeholder="seu@email.com" onFocus={focusIn} onBlur={focusOut} />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: pickupEnabled && deliveryEnabled ? '1fr 1fr' : '1fr', gap: 12 }} className="checkout-full">
              {deliveryEnabled && (
                <button onClick={() => setDeliveryMethod('delivery')} style={{ padding: '16px 18px', borderRadius: 14, border: `1.5px solid ${deliveryMethod === 'delivery' ? '#32718d' : 'rgba(12,46,42,0.13)'}`, background: deliveryMethod === 'delivery' ? 'rgba(50,113,141,0.1)' : '#fffdf7', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', boxShadow: deliveryMethod === 'delivery' ? '0 12px 26px rgba(50,113,141,0.12)' : 'none' }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: '#0b2f2b', marginBottom: 4 }}>Entrega</p>
                  <p style={{ fontSize: 11, color: deliveryMethod === 'delivery' ? '#32718d' : '#596760', fontWeight: deliveryMethod === 'delivery' ? 800 : 500 }}>
                    {freeShippingApplied ? 'Frete gratis para este pedido' : shippingQuote ? `${shippingQuote.selected.serviceName} · R$ ${shippingAmount.toFixed(2).replace('.', ',')}` : 'Frete calculado pelo CEP'}
                  </p>
                </button>
              )}
              {pickupEnabled && (
                <button onClick={() => setDeliveryMethod('pickup')} style={{ padding: '16px 18px', borderRadius: 14, border: `1.5px solid ${deliveryMethod === 'pickup' ? '#0f9f5f' : 'rgba(12,46,42,0.13)'}`, background: deliveryMethod === 'pickup' ? 'rgba(15,159,95,0.1)' : '#fffdf7', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', boxShadow: deliveryMethod === 'pickup' ? '0 12px 26px rgba(15,159,95,0.12)' : 'none' }}>
                  <p style={{ fontSize: 14, fontWeight: 900, color: '#0b2f2b', marginBottom: 4 }}>Retirar na loja</p>
                  <p style={{ fontSize: 11, color: deliveryMethod === 'pickup' ? '#0f9f5f' : '#596760', fontWeight: deliveryMethod === 'pickup' ? 800 : 500 }}>Sem custo de frete</p>
                </button>
              )}
            </div>

            {deliveryMethod === 'delivery' ? (
              <>
                <div>
                  <label style={lbl}>CEP</label>
                  <input style={inp} value={form.cep} onChange={set('cep')} placeholder="65900-000" onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={lbl}>Estado</label>
                  <input style={inp} value={form.estado} onChange={set('estado')} placeholder="MA" onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div style={{ gridColumn: 'span 2' }} className="checkout-full">
                  <label style={lbl}>Rua / Avenida</label>
                  <input style={inp} value={form.rua} onChange={set('rua')} placeholder="Rua Exemplo" onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={lbl}>Número</label>
                  <input style={inp} value={form.num} onChange={set('num')} placeholder="123" onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={lbl}>Complemento</label>
                  <input style={inp} value={form.comp} onChange={set('comp')} placeholder="Apto, bloco, referência" onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={lbl}>Bairro</label>
                  <input style={inp} value={form.bairro} onChange={set('bairro')} placeholder="Centro" onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={lbl}>Cidade</label>
                  <input style={inp} value={form.cidade} onChange={set('cidade')} placeholder="Imperatriz" onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div style={{ gridColumn: 'span 2' }} className="checkout-full">
                  <div style={{ padding: '14px 16px', borderRadius: 14, background: shippingError ? 'rgba(184,132,44,0.1)' : 'rgba(50,113,141,0.08)', border: `1px solid ${shippingError ? 'rgba(184,132,44,0.22)' : 'rgba(50,113,141,0.16)'}`, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {shippingLoading ? <Loader2 size={16} style={{ color: '#32718d', flexShrink: 0, marginTop: 1, animation: 'spin 1s linear infinite' }} /> : <MapPin size={16} style={{ color: shippingError ? '#9b6d22' : '#32718d', flexShrink: 0, marginTop: 1 }} />}
                    <div>
                      <p style={{ fontSize: 12, color: '#0b2f2b', fontWeight: 900, marginBottom: 3 }}>
                        {freeShippingApplied ? 'Frete gratis aplicado' : shippingQuote ? `Frete ${shippingQuote.selected.serviceName} calculado` : shippingLoading ? 'Calculando frete pelos Correios' : 'Calculo automatico de frete'}
                      </p>
                      <p style={{ fontSize: 12, color: shippingError ? '#6d5425' : '#32718d', lineHeight: 1.6 }}>
                        {freeShippingApplied
                          ? 'Este pedido atingiu uma regra de frete gratis. O valor da entrega fica zerado no Mercado Pago.'
                          : shippingQuote
                            ? `Valor: R$ ${shippingAmount.toFixed(2).replace('.', ',')}${shippingQuote.selected.deadlineText ? ` · Prazo estimado: ${shippingQuote.selected.deadlineText}` : ''}. Esse frete ja entra no total.`
                            : shippingError
                              ? `${shippingError}${whatsapp ? ` Se precisar, finalize com retirada ou fale conosco no WhatsApp ${whatsapp}.` : ''}`
                              : 'Digite um CEP valido para buscar valor e prazo antes de seguir para pagamento.'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ gridColumn: 'span 2' }} className="checkout-full">
                <div style={{ padding: '14px 16px', borderRadius: 14, background: 'rgba(15,159,95,0.08)', border: '1px solid rgba(15,159,95,0.16)', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <Store size={16} style={{ color: '#0f9f5f', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 900, color: '#0b2f2b', marginBottom: 3 }}>Retirada gratuita</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin size={10} style={{ color: '#0f9f5f' }} />
                      <span style={{ fontSize: 11, color: '#596760' }}>{storeAddress}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                      <Clock size={10} style={{ color: '#0f9f5f' }} />
                      <span style={{ fontSize: 11, color: '#596760' }}>{storeHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: `${cardEnabled ? '1fr' : ''}${cardEnabled && pixEnabled ? ' 1fr' : ''}${pixEnabled ? '' : ''}`.trim() || '1fr', gap: 12 }}>
              {cardEnabled && (
                <button onClick={() => setPayMethod('cartao')} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${resolvedPayMethod === 'cartao' ? '#b8842c' : 'rgba(12,46,42,0.13)'}`, background: resolvedPayMethod === 'cartao' ? 'rgba(216,168,74,0.12)' : '#fffdf7', transition: 'all 0.2s', textAlign: 'left', boxShadow: resolvedPayMethod === 'cartao' ? '0 12px 26px rgba(184,132,44,0.12)' : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: resolvedPayMethod === 'cartao' ? 'rgba(216,168,74,0.18)' : 'rgba(12,46,42,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CreditCard size={20} style={{ color: resolvedPayMethod === 'cartao' ? '#9b6d22' : '#596760' }} />
                  </div>
                  <div>
                  <p style={{ fontSize: 14, fontWeight: 900, color: '#0b2f2b', marginBottom: 2 }}>Cartão</p>
                  <p style={{ fontSize: 11, color: resolvedPayMethod === 'cartao' ? '#9b6d22' : '#596760', fontWeight: resolvedPayMethod === 'cartao' ? 800 : 500 }}>Parcele em até {maxInstallments}x</p>
                  </div>
                </button>
              )}
              {pixEnabled && (
                <button onClick={() => setPayMethod('pix')} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit', border: `1.5px solid ${resolvedPayMethod === 'pix' ? '#0f9f5f' : 'rgba(12,46,42,0.13)'}`, background: resolvedPayMethod === 'pix' ? 'rgba(15,159,95,0.1)' : '#fffdf7', transition: 'all 0.2s', textAlign: 'left', boxShadow: resolvedPayMethod === 'pix' ? '0 12px 26px rgba(15,159,95,0.12)' : 'none' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: resolvedPayMethod === 'pix' ? 'rgba(15,159,95,0.16)' : 'rgba(12,46,42,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={20} style={{ color: resolvedPayMethod === 'pix' ? '#0f9f5f' : '#596760' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 900, color: '#0b2f2b', marginBottom: 2 }}>PIX</p>
                    <p style={{ fontSize: 11, color: resolvedPayMethod === 'pix' ? '#0f9f5f' : '#596760', fontWeight: resolvedPayMethod === 'pix' ? 800 : 500 }}>Desconto na hora</p>
                  </div>
                </button>
              )}
            </div>

            {resolvedPayMethod === 'cartao' && cardEnabled && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={lbl}>Parcelamento</label>
                  <select style={{ ...inp, cursor: 'pointer', appearance: 'none' as const }} value={form.parcelas} onChange={set('parcelas')} onFocus={focusIn} onBlur={focusOut}>
                    {Array.from({ length: maxInstallments }, (_, idx) => idx + 1).map((n) => (
                      <option key={n} value={n} style={{ background: '#fffdf7', color: '#0b2f2b' }}>
                        {n}x {n === 1 ? '(à vista)' : n <= interestFreeInstallments ? '(sem juros)' : '(juros no checkout)'}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(216,168,74,0.1)', border: '1px solid rgba(216,168,74,0.2)' }}>
                  <p style={{ fontSize: 12, color: '#6d5425', lineHeight: 1.7 }}>
                    Os dados do cartão serão preenchidos com segurança no checkout oficial do Mercado Pago. Na sua loja o cliente escolhe apenas a quantidade de parcelas.
                  </p>
                </div>
              </div>
            )}

            {resolvedPayMethod === 'pix' && pixEnabled && (
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.1fr) minmax(220px,0.9fr)', gap: 14, alignItems: 'stretch' }} className="checkout-pix-guide">
                <div style={{ padding: '18px', borderRadius: 16, background: 'linear-gradient(135deg,rgba(15,159,95,0.1),rgba(255,253,247,0.94))', border: '1px solid rgba(15,159,95,0.18)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 14, background: 'rgba(15,159,95,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Zap size={20} style={{ color: '#0f9f5f' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 950, color: '#0b2f2b', marginBottom: 2 }}>PIX pelo Mercado Pago</p>
                      <p style={{ fontSize: 11.5, color: '#596760' }}>Clique no botão abaixo e pague no ambiente seguro.</p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {[
                      'Você será levado para o Mercado Pago.',
                      'Escolha PIX e pague pelo app do seu banco.',
                      'A confirmação volta automaticamente para a ZAYEH.',
                    ].map((text, index) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#0f9f5f', color: '#fffdf7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, flexShrink: 0 }}>{index + 1}</span>
                        <span style={{ fontSize: 12, color: '#0b2f2b', lineHeight: 1.45 }}>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ padding: '18px', borderRadius: 16, background: '#fffdf7', border: '1px solid rgba(12,46,42,0.12)', boxShadow: '0 16px 32px rgba(12,46,42,0.07)' }}>
                  <p style={{ fontSize: 10.5, fontWeight: 900, color: '#0f9f5f', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>Valor no Pix</p>
                  <p style={{ fontWeight: 950, fontSize: 28, color: '#0b2f2b', marginBottom: 4 }}>R$ {pixTotal.toFixed(2).replace('.', ',')}</p>
                  <p style={{ fontSize: 12, color: '#0f9f5f', fontWeight: 800 }}>Economia de R$ {pixDiscount.toFixed(2).replace('.', ',')}</p>
                  <p style={{ fontSize: 11.5, color: '#596760', marginTop: 12, lineHeight: 1.55 }}>
                    Não precisa copiar chave nem preencher dados aqui. O pagamento abre pronto no Mercado Pago.
                  </p>
                </div>
              </div>
            )}

            <div style={{ padding: '14px 16px', borderRadius: 14, background: deliveryMethod === 'pickup' ? 'rgba(15,159,95,0.08)' : 'rgba(50,113,141,0.08)', border: `1px solid ${deliveryMethod === 'pickup' ? 'rgba(15,159,95,0.16)' : 'rgba(50,113,141,0.16)'}`, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              {deliveryMethod === 'pickup' ? <Store size={16} style={{ color: '#0f9f5f', flexShrink: 0, marginTop: 2 }} /> : <MapPin size={16} style={{ color: '#32718d', flexShrink: 0, marginTop: 2 }} />}
              <div>
                <p style={{ fontSize: 12, fontWeight: 900, color: '#0b2f2b', marginBottom: 3 }}>
                  {deliveryMethod === 'pickup' ? 'Retirada na loja · Gratuita' : freeShippingApplied ? 'Entrega com frete gratis' : shippingQuote ? `Entrega Correios · ${shippingQuote.selected.serviceName}` : 'Entrega com frete pelo CEP'}
                </p>
                {deliveryMethod === 'pickup' ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin size={10} style={{ color: '#0f9f5f' }} />
                      <span style={{ fontSize: 11, color: '#596760' }}>{storeAddress}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                      <Clock size={10} style={{ color: '#0f9f5f' }} />
                      <span style={{ fontSize: 11, color: '#596760' }}>{storeHours}</span>
                    </div>
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: '#596760' }}>
                    {freeShippingApplied ? 'Sua entrega entrou em promoção de frete grátis.' : shippingQuote ? `R$ ${shippingAmount.toFixed(2).replace('.', ',')}${shippingQuote.selected.deadlineText ? ` · ${shippingQuote.selected.deadlineText}` : ''}. Valor incluido no total.` : 'Informe um CEP valido para calcular automaticamente.'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.map((item) => (
              <div key={`${item.product.id}-${item.size}`} style={{ display: 'flex', gap: 12, padding: '12px', borderRadius: 14, background: 'linear-gradient(135deg,#fffdf7,#f3ead6)', border: '1px solid rgba(12,46,42,0.12)', boxShadow: '0 14px 28px rgba(12,46,42,0.07)' }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: 52, height: 64, objectFit: 'contain', borderRadius: 10, flexShrink: 0, background: 'linear-gradient(160deg,#f8f1df,#dce7df)', border: '1px solid rgba(12,46,42,0.1)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 900, color: '#0b2f2b', fontSize: 13, marginBottom: 3 }}>{item.product.name}</p>
                  <p style={{ fontSize: 11, color: '#596760', marginBottom: 4 }}>
                    {item.color ? `${item.color} · ` : ''}{item.size} · Qtd: {item.quantity}
                  </p>
                  <p style={{ fontWeight: 950, color: '#0e5a51', fontSize: 14 }}>R$ {((resolvedPayMethod === 'pix' ? getProductPricing(item.product, pricingSettings).pixPrice : item.product.price) * item.quantity).toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
            ))}
            <div style={{ padding: '16px', borderRadius: 14, background: '#fffdf7', border: '1px solid rgba(12,46,42,0.12)', marginTop: 4, boxShadow: '0 14px 30px rgba(12,46,42,0.07)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#596760' }}>Entrega</span>
                  <span style={{ color: freeShippingApplied || deliveryMethod === 'pickup' ? '#0f9f5f' : '#32718d', fontWeight: 800 }}>{deliverySummary}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#596760' }}>Pagamento</span>
                  <span style={{ color: '#0b2f2b', fontWeight: 700 }}>{resolvedPayMethod === 'cartao' ? `Cartão ${form.parcelas}x${Number(form.parcelas) > interestFreeInstallments ? ' com juros' : ''}` : 'PIX'}</span>
                </div>
                {deliveryMethod === 'delivery' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, gap: 12 }}>
                    <span style={{ color: '#596760' }}>Entrega em</span>
                    <span style={{ color: '#0b2f2b', textAlign: 'right', fontWeight: 650 }}>
                      {`${form.rua}, ${form.num}${form.comp ? ` · ${form.comp}` : ''} - ${form.bairro} · ${form.cidade}/${form.estado}`}
                    </span>
                  </div>
                )}
                {!freeShippingApplied && deliveryMethod === 'delivery' && !shippingQuote && (
                  <p style={{ fontSize: 11, color: '#596760', lineHeight: 1.5 }}>
                    Informe um CEP valido para calcular o frete automaticamente antes do pagamento.
                  </p>
                )}
                {shippingQuote && deliveryMethod === 'delivery' && !freeShippingApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: '#596760' }}>Frete</span>
                    <span style={{ color: '#0e5a51', fontWeight: 900 }}>
                      R$ {shippingAmount.toFixed(2).replace('.', ',')} {shippingQuote.selected.deadlineText ? `· ${shippingQuote.selected.deadlineText}` : ''}
                    </span>
                  </div>
                )}
                <div style={{ height: 1, background: 'rgba(12,46,42,0.1)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 900, color: '#0b2f2b', fontSize: 14 }}>Total</span>
                  <span style={{ fontWeight: 950, color: '#0e5a51', fontSize: 18 }}>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );

  const Summary = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {cart.map((item) => (
          <div key={`${item.product.id}-${item.size}`} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <img src={item.product.image} alt={item.product.name} style={{ width: 44, height: 52, objectFit: 'contain', borderRadius: 8, flexShrink: 0, background: 'linear-gradient(160deg,#f8f1df,#dce7df)', border: '1px solid rgba(12,46,42,0.1)' }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#0b2f2b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.product.name}</p>
              <p style={{ fontSize: 10.5, color: '#596760', marginTop: 2 }}>{item.size} · ×{item.quantity}</p>
            </div>
            <p style={{ fontSize: 12, fontWeight: 900, color: '#0e5a51', flexShrink: 0 }}>
              R$ {((resolvedPayMethod === 'pix' ? getProductPricing(item.product, pricingSettings).pixPrice : item.product.price) * item.quantity).toFixed(2).replace('.', ',')}
            </p>
          </div>
        ))}
      </div>

      <div style={{ height: 1, background: 'rgba(12,46,42,0.1)' }} />

      {!couponApplied ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Tag size={12} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#596760', pointerEvents: 'none' }} />
            <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Cupom de desconto" style={{ ...inp, paddingLeft: 30, fontSize: 12 }} onFocus={focusIn} onBlur={focusOut} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} />
          </div>
          <button onClick={applyCoupon} style={{ padding: '0 14px', borderRadius: 10, border: '1px solid rgba(12,46,42,0.16)', background: '#fffdf7', color: '#0e5a51', fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            USAR
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <CheckCircle size={13} style={{ color: '#22C55E' }} />
          <span style={{ fontSize: 12, color: '#22C55E', fontWeight: 700, flex: 1 }}>{coupon.toUpperCase()} aplicado!</span>
          <button onClick={resetCoupon} style={{ fontSize: 13, color: '#596760', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555' }}>
          <span>Subtotal</span><span>R$ {(resolvedPayMethod === 'pix' ? pixTotal : subtotal).toFixed(2).replace('.', ',')}</span>
        </div>
        {resolvedPayMethod === 'pix' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#22C55E' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Zap size={10} />PIX</span>
            <span>−R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        {couponApplied && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#22C55E' }}>
            <span>{couponFreeShipping && couponDiscount === 0 ? 'Cupom de frete' : 'Cupom'}</span>
            <span>{couponDiscount > 0 ? `−R$ ${couponDiscount.toFixed(2).replace('.', ',')}` : 'Aplicado'}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#555' }}>
          <span>Entrega</span>
          <span style={{ color: freeShippingApplied || deliveryMethod === 'pickup' ? '#22C55E' : '#60a5fa', fontWeight: 700 }}>{deliverySummary}</span>
        </div>
        {shippingQuote && deliveryMethod === 'delivery' && !freeShippingApplied && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#596760' }}>
            <span>{shippingQuote.selected.serviceName}</span>
            <span>{shippingQuote.selected.deadlineText || 'Prazo Correios'}</span>
          </div>
        )}
        {deliveryMethod === 'delivery' && !freeShippingApplied && !shippingQuote && (
          <p style={{ fontSize: 11, color: '#596760', lineHeight: 1.5 }}>
            Digite o CEP para calcular o frete automaticamente antes de pagar.
          </p>
        )}
        <div style={{ height: 1, background: 'rgba(12,46,42,0.1)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 900, fontSize: 14, color: '#0b2f2b' }}>Total</span>
          <span style={{ fontWeight: 950, fontSize: 20, color: '#0e5a51' }}>R$ {total.toFixed(2).replace('.', ',')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: 'rgba(216,168,74,0.07)', border: '1px solid rgba(216,168,74,0.15)' }}>
          <Coins size={13} style={{ color: '#d8a84a', flexShrink: 0 }} />
          <span style={{ fontSize: 11.5, color: '#d8a84a', fontWeight: 700 }}>+R$ {cashback.toFixed(2).replace('.', ',')} cashback (5%)</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.1)' }}>
        <Lock size={12} style={{ color: '#22C55E', flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: '#22C55E' }}>Compra 100% segura e protegida</span>
      </div>
    </div>
  );

  return (
    <div className="checkout-page" style={{ paddingTop: 24, paddingLeft: 16, paddingRight: 16, maxWidth: 1040, margin: '0 auto', width: '100%' }}>
      {Stepper()}

      <div className="checkout-layout">
        <div style={{ background: 'rgba(255,253,247,0.9)', borderRadius: 18, border: '1px solid rgba(12,46,42,0.12)', padding: '24px', boxShadow: '0 22px 60px rgba(12,46,42,0.1)' }}>
          <p style={{ fontSize: 10, fontWeight: 900, color: '#d8a84a', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 20 }}>
            {STEPS[step]}
          </p>
          {StepForm()}

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            {step > 0 && (
              <button onClick={prev} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 18px', borderRadius: 12, border: '1px solid rgba(12,46,42,0.14)', background: '#fffdf7', color: '#596760', fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.06em', transition: 'all 0.2s' }}>
                <ChevronLeft size={14} /> VOLTAR
              </button>
            )}
            <button onClick={next} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 12, border: 'none', background: step === 1 ? 'linear-gradient(135deg,#0d2f2b,#15564e)' : 'linear-gradient(135deg,#b8842c,#f0cf82)', color: step === 1 ? '#fffdf7' : '#111', fontWeight: 950, fontSize: 13, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 16px 30px rgba(12,46,42,0.15)' }}>
              {submitting ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> PROCESSANDO...</> : step === 1 ? <><Lock size={14} /> PAGAR COM MERCADO PAGO</> : <>CONTINUAR <ChevronRight size={14} /></>}
            </button>
          </div>
        </div>

        <div>
          <button onClick={() => setSummaryOpen((v) => !v)} className="checkout-summary-toggle" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: 14, border: '1px solid rgba(12,46,42,0.12)', background: '#fffdf7', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10, boxShadow: '0 12px 28px rgba(12,46,42,0.08)' }}>
            <span style={{ fontSize: 12, color: '#596760', fontWeight: 800 }}>Resumo do pedido</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontWeight: 950, color: '#0e5a51', fontSize: 15 }}>R$ {total.toFixed(2).replace('.', ',')}</span>
              <ChevronRight size={14} style={{ color: '#596760', transform: summaryOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
          </button>
          <div className={`checkout-summary-card${summaryOpen ? ' open' : ''}`} style={{ background: '#fffdf7', borderRadius: 18, border: '1px solid rgba(12,46,42,0.12)', padding: '20px', boxShadow: '0 22px 54px rgba(12,46,42,0.1)' }}>
            {Summary()}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 10.5, color: '#555', textAlign: 'center', marginTop: 28, letterSpacing: '0.04em' }}>
        Desenvolvido por <span style={{ color: '#d8a84a', fontWeight: 700 }}>NEXUS TECNOLOGIA LTDA</span>
      </p>
    </div>
  );
}

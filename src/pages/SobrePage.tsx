import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Heart, Zap, Star, Users, Award } from 'lucide-react';
import { buildWhatsAppLink, useStoreSettings } from '../lib/storeSettings';

const values = [
  {
    icon: Heart,
    title: 'Feito com Amor',
    desc: 'Cada peça é pensada com cuidado, do design ao acabamento, para você se sentir único.',
    color: '#FF2DA0',
  },
  {
    icon: Zap,
    title: 'Atitude que Vence',
    desc: 'Nossa moda é para quem não para. Roupas que acompanham seu ritmo, do dia à noite.',
    color: '#FFB800',
  },
  {
    icon: Star,
    title: 'Qualidade Real',
    desc: 'Tecidos premium, costura reforçada e acabamento impecável. Qualidade que você sente.',
    color: '#818CF8',
  },
  {
    icon: Users,
    title: 'Para a Nossa Gente',
    desc: 'Nascemos no Maranhão para o Brasil inteiro. Estilo acessível, sem abrir mão da identidade.',
    color: '#22C55E',
  },
];

const stats = [
  { value: '2019', label: 'Fundada em' },
  { value: '3.000+', label: 'Clientes satisfeitos' },
  { value: '150+', label: 'Modelos exclusivos' },
  { value: '4.8★', label: 'Avaliação média' },
];

export default function SobrePage() {
  const settings = useStoreSettings();
  const whatsappHref = buildWhatsAppLink(settings.whatsapp, 'Olá! Quero falar com a equipe da ZAYEH.');

  return (
    <div style={{ background: '#0b0b0b', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(60px,10vw,100px) 20px clamp(48px,8vw,80px)', textAlign: 'center' }}>
        {/* Background pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none' }}>
          <svg width="100%" height="100%" viewBox="0 0 1200 500" preserveAspectRatio="xMidYMid slice">
            <rect x="60" y="40" width="1080" height="420" fill="none" stroke="#FFB800" strokeWidth="2" />
            <line x1="600" y1="40" x2="600" y2="460" stroke="#FFB800" strokeWidth="1.5" />
            <circle cx="600" cy="250" r="100" fill="none" stroke="#FFB800" strokeWidth="1.5" />
          </svg>
        </div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,45,160,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', padding: '5px 14px', borderRadius: 99, background: 'rgba(255,184,0,0.08)', color: '#FFB800', border: '1px solid rgba(255,184,0,0.2)', marginBottom: 24 }}>
            NOSSA HISTÓRIA
          </div>

          <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#fff', lineHeight: 0.95, letterSpacing: '0.06em', marginBottom: 24 }}>
            ZAYEH<br /><span style={{ background: 'linear-gradient(135deg, #b8842c, #f0cf82)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>STUDIO EDIT</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: '#888', lineHeight: 1.7, marginBottom: 32 }}>
            Nascemos no coração do Maranhão com uma missão simples:<br />
            criar moda que representa quem você é, de verdade.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#555', fontSize: 13 }}>
            <MapPin size={14} style={{ color: '#FF2DA0' }} />
            Imperatriz – MA, Brasil
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 24 }}>
            {stats.map((s, i) => (
              <motion.div key={s.label}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{ textAlign: 'center', padding: '8px 0' }}>
                <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: '#fff', lineHeight: 1, marginBottom: 6 }}>
                  {s.value}
                </p>
                <p style={{ fontSize: 11, color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60, alignItems: 'center' }}>

          {/* Visual */}
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', aspectRatio: '4/5', background: 'linear-gradient(160deg, #1a0010 0%, #0b0b0b 50%, #001a00 100%)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Abstract fashion graphic */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 300 400" width="280" height="360" fill="none">
                  {/* Large stylized S */}
                  <path d="M180 80 Q220 80 220 120 Q220 160 160 160 Q100 160 100 200 Q100 240 140 240 Q180 240 180 280 Q180 320 140 320" stroke="url(#g1)" strokeWidth="16" strokeLinecap="round" fill="none" />
                  <defs>
                    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FF2DA0" />
                      <stop offset="50%" stopColor="#FFB800" />
                      <stop offset="100%" stopColor="#22C55E" />
                    </linearGradient>
                  </defs>
                  {/* Decorative dots */}
                  <circle cx="220" cy="80" r="6" fill="#FFB800" opacity="0.6" />
                  <circle cx="100" cy="200" r="5" fill="#FF2DA0" opacity="0.5" />
                  <circle cx="140" cy="320" r="7" fill="#22C55E" opacity="0.6" />
                  {/* Lines */}
                  <line x1="40" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <line x1="200" y1="350" x2="260" y2="350" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  <circle cx="150" cy="200" r="80" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="8 5" />
                </svg>
              </div>

              {/* Corner badge */}
              <div style={{ position: 'absolute', bottom: 24, right: 24, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 22, color: '#fff', lineHeight: 1 }}>ZAYEH</p>
                <p style={{ fontSize: 8, color: '#8f7a4b', letterSpacing: '0.3em' }}>STREETWEAR</p>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <p style={{ fontSize: 10, fontWeight: 900, color: '#FF2DA0', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>QUEM SOMOS</p>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', color: '#fff', lineHeight: 1.1, letterSpacing: '0.06em', marginBottom: 24 }}>
              ESTILO QUE<br />REPRESENTA
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
                A ZAYEH nasceu para construir uma vitrine mais elegante, autoral e atual.
                A proposta é oferecer moda, acessórios e perfumaria com mais direção de arte
                e menos aparência de loja genérica.
              </p>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
                Cada detalhe foi pensado para passar presença premium: contraste quente,
                tipografia forte, recortes mais limpos e uma seleção que conversa entre si
                do início ao fim da navegação.
              </p>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.8 }}>
                Cada coleção agora carrega uma assinatura própria.
                Se você chegou até aqui, já faz parte do novo momento da ZAYEH.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 32 }}>
              <Award size={16} style={{ color: '#FFB800', flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: '#555' }}>
                <span style={{ color: '#FFB800', fontWeight: 700 }}>Nova fase</span> com linguagem visual mais premium e autoral
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '80px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 10, fontWeight: 900, color: '#FFB800', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10 }}>NOSSA ESSÊNCIA</p>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#fff', letterSpacing: '0.06em' }}>
              NOSSOS VALORES
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
            {values.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{ background: '#111', borderRadius: 14, padding: '28px 24px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${v.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, border: `1px solid ${v.color}25` }}>
                  <v.icon size={20} style={{ color: v.color }} />
                </div>
                <h3 style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 10 }}>{v.title}</h3>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,45,160,0.08)', border: '1px solid rgba(255,45,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <MapPin size={22} style={{ color: '#FF2DA0' }} />
            </div>

            <p style={{ fontSize: 10, fontWeight: 900, color: '#FF2DA0', letterSpacing: '0.2em', marginBottom: 12 }}>ONDE ESTAMOS</p>
            <h2 style={{ fontFamily: 'Cinzel, serif', fontWeight: 900, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#fff', letterSpacing: '0.06em', marginBottom: 16 }}>
              IMPERATRIZ – MA
            </h2>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8, marginBottom: 36 }}>
              Nascemos aqui e levamos o Maranhão para o Brasil inteiro.<br />
              Atendemos por todo o território nacional com entregas rápidas e seguras.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/categoria/todos" className="no-underline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 8, background: 'linear-gradient(135deg, #FF2DA0, #f97316)', color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: '0.06em' }}>
                EXPLORAR COLEÇÃO <ArrowRight size={15} />
              </Link>
              {whatsappHref ? (
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="no-underline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 8, background: 'transparent', color: '#888', fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#888'; }}>
                  FALAR COM A GENTE
                </a>
              ) : (
                <Link to="/contato" className="no-underline"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 8, background: 'transparent', color: '#888', fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', border: '1px solid rgba(255,255,255,0.1)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.color = '#888'; }}>
                  FALAR COM A GENTE
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

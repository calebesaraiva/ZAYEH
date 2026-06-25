import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const pillars = [
  {
    eyebrow: 'CURADORIA',
    title: 'Peças com leitura mais refinada',
    text: 'Mistura de streetwear, perfumaria e acessórios com seleção mais limpa e acabamento visual premium.',
    accent: '#d8a84a',
  },
  {
    eyebrow: 'NEW MOOD',
    title: 'Identidade própria em cada bloco',
    text: 'Tipografia mais forte, contraste quente e cards com menos ruído para a vitrine respirar melhor.',
    accent: '#c49b51',
  },
  {
    eyebrow: 'MULTI-CAT',
    title: 'Moda e perfume em uma linguagem única',
    text: 'Tudo conversa entre si para a marca parecer mais autoral, menos genérica e bem mais memorável.',
    accent: '#e6c98d',
  },
];

export default function Testimonials() {
  return (
    <section className="section-gap" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-label">DIREÇÃO DE ESTILO</p>
          <h2 className="section-title">ASSINATURA VISUAL</h2>
        </div>

        <div className="testimonials-grid">
          {pillars.map((item, i) => (
            <motion.div key={item.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="testimonial-card"
            style={{ background: 'linear-gradient(180deg, #131313, #0f0f10)', borderRadius: 20, border: '1px solid rgba(255,255,255,0.07)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at top right, ${item.accent}22, transparent 45%)` }} />
              <div style={{ position: 'relative' }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${item.accent}18`, border: `1px solid ${item.accent}44`, marginBottom: 18 }}>
                  <ArrowUpRight size={18} style={{ color: item.accent }} />
                </div>

                <p style={{ fontSize: 10, color: item.accent, fontWeight: 900, letterSpacing: '0.22em', marginBottom: 10 }}>
                  {item.eyebrow}
                </p>
                <h3 style={{ fontSize: 23, color: '#f7f1e6', fontWeight: 800, lineHeight: 1.1, marginBottom: 14 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 13, color: '#8f8b82', lineHeight: 1.8 }}>
                  {item.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 36, padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 13, color: '#8f8b82', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            ZAYEH studio edit
          </p>
        </motion.div>
      </div>
    </section>
  );
}

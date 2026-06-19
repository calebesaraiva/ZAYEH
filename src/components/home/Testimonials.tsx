import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Ana Carolina',
    city: 'São Luís, MA',
    rating: 5,
    text: 'Amei demais! Qualidade incrível, entrega rápida. Já pedi 3 vezes e todas foram perfeitas. A coleção Copa ficou INCRÍVEL.',
    item: 'Conjunto Copa 2026 Feminino',
    avatar: 'AC',
    color: '#FF2DA0',
  },
  {
    name: 'Gabriel Torres',
    city: 'Belém, PA',
    rating: 5,
    text: 'O moletom chegou melhor do que esperava. Tecido grosso, acabamento impecável. Recomendo demais pra galera.',
    item: 'Moletom Oversized',
    avatar: 'GT',
    color: '#818CF8',
  },
  {
    name: 'Mariana Souza',
    city: 'Fortaleza, CE',
    rating: 5,
    text: 'Finalmente uma marca brasileira com esse nível. A qualidade compete com marcas internacionais. Estou apaixonada!',
    item: 'Cropped Copa 2026',
    avatar: 'MS',
    color: '#22C55E',
  },
  {
    name: 'Rafael Lima',
    city: 'Brasília, DF',
    rating: 5,
    text: 'Atendimento top, produto chegou embalado com muito cuidado. A camisa polo é simplesmente perfeita para o dia a dia.',
    item: 'Polo SUH Concept',
    avatar: 'RL',
    color: '#FFB800',
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={12} fill="#FFB800" stroke="none" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="section-gap" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p className="section-label">QUEM USA, APROVA</p>
          <h2 className="section-title">DEPOIMENTOS</h2>
        </div>

        <div className="testimonials-grid">
          {reviews.map((r, i) => (
            <motion.div key={r.name}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="testimonial-card"
            style={{ background: '#111', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>

              <Quote size={24} style={{ position: 'absolute', top: 12, right: 12, color: 'rgba(255,255,255,0.04)', transform: 'scaleX(-1)' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${r.color}22`, border: `1.5px solid ${r.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: r.color }}>{r.avatar}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 12, color: '#fff', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</p>
                  <p style={{ fontSize: 10, color: '#444' }}>{r.city}</p>
                </div>
              </div>

              <Stars n={r.rating} />

              <p style={{ fontSize: 11, color: '#666', lineHeight: 1.65, marginTop: 8, marginBottom: 10 }}>
                "{r.text}"
              </p>

              <p style={{ fontSize: 10, color: '#444', fontWeight: 600 }}>
                <span style={{ color: '#555' }}>{r.item}</span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 36, padding: '20px 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="#FFB800" stroke="none" />)}
          </div>
          <p style={{ fontSize: 13, color: '#555' }}>
            Clientes satisfeitos em todo o Brasil
          </p>
        </motion.div>
      </div>
    </section>
  );
}

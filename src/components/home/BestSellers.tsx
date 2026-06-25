import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../../lib/useApi';
import ProductCard from '../ui/ProductCard';

export default function BestSellers() {
  const { data, loading } = useProducts({ bestSeller: 'true', limit: '8' });
  const items = data?.products ?? [];

  if (!loading && items.length === 0) return null;

  return (
    <section className="section-gap">
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div className="section-header">
          <div>
            <p className="section-label">EM ALTA</p>
            <h2 className="section-title">MAIS VENDIDOS</h2>
          </div>
          <Link to="/categoria/todos" className="no-underline" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#555', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = '#555')}>
            VER TODOS <ArrowRight size={14} />
          </Link>
        </div>

        <div className="product-grid">
          {items.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 48 }}>
          <Link to="/categoria/todos" className="btn-outline no-underline" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            VER TODOS OS PRODUTOS <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

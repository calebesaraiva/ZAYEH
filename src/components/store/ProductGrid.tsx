import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3X3, LayoutList, Trophy } from 'lucide-react';
import { products, categories } from '../../data/products';
import { useStore } from '../../store/useStore';
import type { Product } from '../../store/useStore';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function ProductGrid() {
  const { selectedCategory, setSelectedCategory, searchQuery } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState('destaque');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const categoryOptions = [{ slug: 'todos', label: 'Todos', count: products.length }, ...categories.map((cat) => ({
    ...cat,
    count: products.filter((product) => product.categorySlug === cat.slug).length,
  }))];

  const filtered = useMemo(() => {
    let list = products;
    if (selectedCategory !== 'todos') list = list.filter((p) => p.categorySlug === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
    }
    switch (sortBy) {
      case 'menor':    return [...list].sort((a, b) => a.price - b.price);
      case 'maior':    return [...list].sort((a, b) => b.price - a.price);
      case 'avaliacao':return [...list].sort((a, b) => b.rating - a.rating);
      case 'novidades':return [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default:         return [...list].sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16" id="produtos">

      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full"
          style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.15)' }}
        >
          <Trophy size={14} className="text-orange-400" />
          <span className="text-sm text-orange-300 font-semibold">Nossa Coleção</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl font-black mb-3"
        >
          Peças que fazem <span className="gradient-text">história</span>
        </motion.h2>
        <p className="text-gray-500">Copa 2026 × Moda Feminina — elegância sem limites ⚽</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-1 flex-1" style={{ scrollbarWidth: 'none' }}>
          {categoryOptions.map(cat => (
            <motion.button
              key={cat.slug} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat.slug
                  ? 'gradient-bg text-white neon-glow'
                  : 'glass text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
              <span className={`ml-1.5 text-xs ${selectedCategory === cat.slug ? 'text-white/60' : 'text-gray-600'}`}>
                {cat.count}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-2 items-center">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input-field text-sm py-2 w-40">
            <option value="destaque">Destaque</option>
            <option value="novidades">Novidades</option>
            <option value="menor">Menor Preço</option>
            <option value="maior">Maior Preço</option>
            <option value="avaliacao">Avaliação</option>
          </select>
          <button onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'text-orange-400 bg-orange-500/15' : 'text-gray-600'}`}>
            <Grid3X3 size={17} />
          </button>
          <button onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'text-orange-400 bg-orange-500/15' : 'text-gray-600'}`}>
            <LayoutList size={17} />
          </button>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-600">
        <span className="text-white font-semibold">{filtered.length}</span> peças encontradas
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg">Nenhuma peça encontrada</p>
            <button onClick={() => setSelectedCategory('todos')} className="mt-4 text-orange-400 underline text-sm">
              Ver todas as peças
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`${selectedCategory}-${sortBy}-${view}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={view === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5'
              : 'flex flex-col gap-4'}
          >
            {filtered.map((product, i) => (
              <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                {view === 'grid' ? (
                  <ProductCard product={product} onClick={setSelectedProduct} />
                ) : (
                  <ListCard product={product} onClick={setSelectedProduct} />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}

function ListCard({ product, onClick }: { product: Product; onClick: (p: Product) => void }) {
  const { addToCart } = useStore();
  return (
    <div className="product-card flex gap-4 p-4" onClick={() => onClick(product)}>
      <img src={product.image} alt={product.name} className="w-24 h-32 object-cover rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex gap-1.5 mb-1">
            {product.isNew && <span className="badge badge-orange">NOVO</span>}
            {product.isBestSeller && <span className="badge badge-gold">🔥 TOP</span>}
          </div>
          <h3 className="font-semibold text-white mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-white">R$ {product.price.toFixed(2).replace('.', ',')}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-600 line-through ml-2">R$ {product.originalPrice.toFixed(2).replace('.', ',')}</span>
            )}
          </div>
          <button
            onClick={e => { e.stopPropagation(); addToCart(product, product.sizes[0], product.colors[0]?.name ?? ''); }}
            className="btn-primary py-2 px-4 text-sm"
          >Adicionar</button>
        </div>
      </div>
    </div>
  );
}

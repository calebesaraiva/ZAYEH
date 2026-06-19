import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import Navbar from './Navbar';
import Hero from './Hero';
import Marquee from './Marquee';
import FeaturedBanner from './FeaturedBanner';
import ProductGrid from './ProductGrid';
import Footer from './Footer';
import CartDrawer from './CartDrawer';

export default function StoreFront() {
  const { cart } = useStore();
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = cart.reduce((a, i) => a + i.quantity, 0);

  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>
      <Navbar />
      <Hero />
      <Marquee />
      <FeaturedBanner />
      <ProductGrid />
      <Footer />

      {/* Floating cart (mobile) */}
      {cartCount > 0 && (
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 gradient-bg rounded-full flex items-center justify-center shadow-2xl neon-glow z-30 md:hidden"
        >
          <span className="text-white font-black text-sm">{cartCount}</span>
        </motion.button>
      )}

      {/* WhatsApp */}
      <motion.a
        href="#" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 left-6 w-12 h-12 rounded-full flex items-center justify-center shadow-xl z-30"
        style={{ background: '#25D366' }}
      >
        <MessageCircle size={22} className="text-white" />
      </motion.a>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Search, Menu, X, LayoutDashboard } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Navbar() {
  const { cart, wishlist, currentView, setCurrentView, searchQuery, setSearchQuery } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = cart.reduce((acc, i) => acc + i.quantity, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = ['Novidades', 'Coleções', 'Copa 2026', 'Blazers', 'Sale'];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-dark py-3 shadow-2xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          className="flex items-center gap-3 cursor-pointer flex-shrink-0"
          onClick={() => setCurrentView('store')}
        >
          {/* Logo ring replicating brand mark */}
          <div className="relative w-9 h-9 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ec4899, #c026d3)',
                padding: '2px',
              }}
            >
              <div className="w-full h-full rounded-full bg-[#050505] flex items-center justify-center">
                <span className="text-[10px] font-black text-white tracking-tight leading-none">SUH</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-black gradient-text tracking-widest uppercase">SUH</span>
            <span className="text-[9px] text-gray-500 tracking-[0.3em] uppercase">Concept</span>
          </div>
        </motion.div>

        {/* Desktop Nav */}
        {currentView === 'store' && (
          <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {navLinks.map((link) => (
              <motion.a
                key={link}
                href="#"
                whileHover={{ color: '#f97316' }}
                className={`text-sm font-medium transition-colors hover:text-orange-400 ${
                  link === 'Copa 2026' ? 'text-yellow-400 font-bold flex items-center gap-1' : 'text-gray-300'
                }`}
              >
                {link === 'Copa 2026' && <span>⚽</span>}
                {link}
              </motion.a>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 180, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="input-field text-sm py-2"
                  onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 text-gray-400 hover:text-orange-400 transition-colors">
            <Search size={19} />
          </motion.button>

          {currentView === 'store' && (
            <>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-400 hover:text-pink-400 transition-colors">
                <Heart size={19} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 gradient-bg rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </motion.button>

              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                className="relative p-2 text-gray-400 hover:text-orange-400 transition-colors">
                <ShoppingBag size={19} />
                {cartCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 gradient-bg rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {cartCount}
                  </motion.span>
                )}
              </motion.button>
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => setCurrentView(currentView === 'store' ? 'dashboard' : 'store')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all ${
              currentView === 'dashboard' ? 'gradient-bg text-white neon-glow' : 'glass text-gray-300 hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">{currentView === 'dashboard' ? 'Ver Loja' : 'Dashboard'}</span>
          </motion.button>

          <button className="md:hidden p-2 text-gray-400" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && currentView === 'store' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden glass-dark border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a key={link} href="#"
                  className={`font-medium py-2 border-b border-white/5 ${link === 'Copa 2026' ? 'text-yellow-400' : 'text-gray-300'}`}>
                  {link === 'Copa 2026' && '⚽ '}{link}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

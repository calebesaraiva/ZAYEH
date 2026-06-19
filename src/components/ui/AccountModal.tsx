import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import AccountPanel from './AccountPanel';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AccountModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(6px)', zIndex: 80 }}
          />
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px 16px',
              zIndex: 81,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: 'min(92vw, 520px)',
                maxHeight: '88vh',
                overflowY: 'auto',
                background: 'linear-gradient(180deg, #0f0f0f 0%, #0b0b0b 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 22,
                boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, color: '#a855f7', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 4 }}>Acesse sua</p>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>Conta</h2>
                </div>
                <button onClick={onClose} style={{ width: 38, height: 38, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding: 18 }}>
                <AccountPanel compact onAuthSuccess={onClose} />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

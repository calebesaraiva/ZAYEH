import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function Toast() {
  const { toast } = useStore();
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="toast"
        >
          {toast.type === 'success'
            ? <CheckCircle size={16} style={{ color: '#22C55E' }} />
            : <XCircle size={16} style={{ color: '#EF4444' }} />
          }
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

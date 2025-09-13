'use client';
import { AnimatePresence, motion } from 'framer-motion';
export default function Modal({ open, onClose, children }: { open: boolean; onClose: ()=>void; children: React.ReactNode; }){
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-3 bg-black/50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="w-full max-w-[420px] mx-auto bg-[#1a1a1f]/80 backdrop-blur-xl border border-white/15 rounded-2xl p-4">
            <div className="flex justify-end"><button aria-label="Закрыть" onClick={onClose} className="btn btn-ghost">✕</button></div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

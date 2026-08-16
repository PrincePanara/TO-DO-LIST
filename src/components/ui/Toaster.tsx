import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, InfoIcon, XIcon } from 'lucide-react';
import { useStudyForge } from '../../contexts/StudyForgeContext';

export function Toaster() {
  const { toasts, dismissToast } = useStudyForge();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-24 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-3 sm:bottom-6">
      
      <AnimatePresence>
        {toasts.map((t) =>
        <motion.div
          key={t.id}
          layout
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className={`pointer-events-auto flex items-center gap-3 border-3 border-ink px-4 py-3 shadow-brut dark:border-white ${
          t.tone === 'error' ? 'bg-danger text-white' : t.tone === 'info' ? 'bg-sun text-ink' : 'bg-ok text-ink'}`
          }>
          
            <span className="flex h-7 w-7 shrink-0 items-center justify-center border-[2px] border-ink bg-white/90 text-ink">
              {t.tone === 'info' ?
            <InfoIcon className="h-4 w-4" strokeWidth={3} /> :

            <CheckIcon className="h-4 w-4" strokeWidth={4} />
            }
            </span>
            <p className="flex-1 font-display text-sm font-bold uppercase tracking-[0.06em]">
              {t.message}
            </p>
            <button
            type="button"
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss notification"
            className="focus-brut">
            
              <XIcon className="h-4 w-4" strokeWidth={3} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>);

}
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { IconButton } from './Button';

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'lg'








}: {open: boolean;onClose: () => void;title: string;subtitle?: string;children: React.ReactNode;footer?: React.ReactNode;width?: 'sm' | 'md' | 'lg' | 'xl';}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const widths = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-xl',
    lg: 'sm:max-w-3xl',
    xl: 'sm:max-w-5xl'
  }[width];

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
          aria-label="Close dialog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/50" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className={twMerge(
            'relative flex max-h-[92vh] w-full flex-col surface shadow-brut-lg',
            widths
          )}>
          
            <header className="flex items-start justify-between gap-4 border-b-3 border-ink bg-sun px-5 py-4 dark:border-white">
              <div>
                <h2 className="font-display text-lg font-bold uppercase tracking-tight text-ink sm:text-xl">
                  {title}
                </h2>
                {subtitle && <p className="text-sm text-ink/70">{subtitle}</p>}
              </div>
              <IconButton label="Close" onClick={onClose} className="shrink-0">
                <XIcon className="h-5 w-5" strokeWidth={3} />
              </IconButton>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer &&
          <footer className="flex flex-wrap items-center justify-end gap-3 border-t-3 border-ink px-5 py-4 dark:border-white">
                {footer}
              </footer>
          }
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer






}: {open: boolean;onClose: () => void;title: string;children: React.ReactNode;footer?: React.ReactNode;}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex justify-end">
          <motion.button
          aria-label="Close panel"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/50" />
        
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
          className="relative flex h-full w-full max-w-md flex-col surface border-y-0 border-r-0">
          
            <header className="flex items-center justify-between gap-4 border-b-3 border-ink bg-brand px-5 py-4 dark:border-white">
              <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">
                {title}
              </h2>
              <IconButton label="Close" onClick={onClose}>
                <XIcon className="h-5 w-5" strokeWidth={3} />
              </IconButton>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
            {footer &&
          <footer className="flex flex-wrap gap-3 border-t-3 border-ink px-5 py-4 dark:border-white">
                {footer}
              </footer>
          }
          </motion.aside>
        </div>
      }
    </AnimatePresence>);

}
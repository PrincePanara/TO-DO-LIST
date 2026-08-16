import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { useQuickAdd, type QuickAddKind } from '../../contexts/QuickAdd';

const actions: {label: string;kind: QuickAddKind;tone: string;}[] = [
{ label: '+ Task', kind: 'task', tone: 'bg-brand text-white' },
{ label: '+ Assignment', kind: 'assignment', tone: 'bg-sun text-ink' },
{ label: '+ Lab', kind: 'lab', tone: 'bg-white text-ink' },
{ label: '+ Mini Project', kind: 'mini-project', tone: 'bg-ok text-ink' },
{ label: '+ Major Project', kind: 'major-project', tone: 'bg-danger text-white' },
{ label: '+ Note', kind: 'note', tone: 'bg-white text-ink' },
{ label: '+ Subject', kind: 'subject', tone: 'bg-brand text-white' },
{ label: '+ Class', kind: 'class', tone: 'bg-sun text-ink' }];


export function AddMenu() {
  const [open, setOpen] = useState(false);
  const { open: quickAdd } = useQuickAdd();

  return (
    <div className="fixed bottom-[76px] right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
      <AnimatePresence>
        {open &&
        <motion.ul
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            visible: { transition: { staggerChildren: 0.035 } },
            hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } }
          }}
          className="flex flex-col items-end gap-2">
          
            {actions.map((a) =>
          <motion.li
            key={a.kind}
            variants={{
              hidden: { opacity: 0, x: 16, scale: 0.96 },
              visible: { opacity: 1, x: 0, scale: 1 }
            }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
            
                <button
              type="button"
              onClick={() => {
                setOpen(false);
                quickAdd(a.kind);
              }}
              className={`border-3 border-ink px-4 py-2 font-display text-sm font-bold uppercase tracking-[0.06em] shadow-brut-sm press focus-brut dark:border-white ${a.tone}`}>
              
                  {a.label}
                </button>
              </motion.li>
          )}
          </motion.ul>
        }
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close add menu' : 'Open add menu'}
        className="flex h-16 w-16 items-center justify-center border-3 border-ink bg-brand text-white shadow-brut press focus-brut dark:border-white">
        
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="flex">
          
          <PlusIcon className="h-8 w-8" strokeWidth={3.5} aria-hidden />
        </motion.span>
      </button>
    </div>);

}
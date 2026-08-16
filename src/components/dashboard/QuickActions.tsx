import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuickAdd, type QuickAddKind } from '../../contexts/QuickAdd';

const actions: {label: string;kind?: QuickAddKind;to?: string;tone: string;}[] = [
{ label: '+ Task', kind: 'task', tone: 'bg-brand text-white' },
{ label: '+ Assignment', kind: 'assignment', tone: 'bg-sun text-ink' },
{ label: '+ Lab', kind: 'lab', tone: 'bg-white text-ink dark:bg-white/10 dark:text-white' },
{ label: '+ Project', kind: 'mini-project', tone: 'bg-ok text-ink' },
{ label: '+ Note', kind: 'note', tone: 'bg-white text-ink dark:bg-white/10 dark:text-white' },
{ label: 'Import PDF', to: '/import', tone: 'bg-ink text-white' }];


export function QuickActions() {
  const { open } = useQuickAdd();
  const navigate = useNavigate();

  return (
    <ul className="grid grid-cols-2 gap-3">
      {actions.map((a) =>
      <li key={a.label}>
          <button
          type="button"
          onClick={() => a.to ? navigate(a.to) : a.kind && open(a.kind)}
          className={`w-full border-3 border-ink px-3 py-4 font-display text-sm font-bold uppercase tracking-[0.06em] shadow-brut-sm press focus-brut dark:border-white ${a.tone}`}>
          
            {a.label}
          </button>
        </li>
      )}
    </ul>);

}
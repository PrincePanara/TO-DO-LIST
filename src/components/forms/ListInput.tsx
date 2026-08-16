import React, { useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/Button';

export function ListInput({
  label,
  values,
  onChange,
  placeholder = 'Type and press enter',
  chips = true






}: {label: string;values: string[];onChange: (v: string[]) => void;placeholder?: string;chips?: boolean;}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...values, value]);
    setDraft('');
  };

  return (
    <div>
      <span className="brut-label">{label}</span>
      {values.length > 0 && (
      chips ?
      <ul className="mb-3 flex flex-wrap gap-2">
            {values.map((v, i) =>
        <li
          key={`${v}-${i}`}
          className="flex items-center gap-2 border-3 border-ink bg-sun px-2 py-1 font-display text-xs font-bold uppercase text-ink dark:border-white">
          
                {v}
                <button
            type="button"
            onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            aria-label={`Remove ${v}`}
            className="focus-brut">
            
                  <XIcon className="h-3.5 w-3.5" strokeWidth={4} />
                </button>
              </li>
        )}
          </ul> :

      <ol className="mb-3 space-y-2">
            {values.map((v, i) =>
        <li
          key={`${v}-${i}`}
          className="flex items-start gap-3 border-3 border-ink px-3 py-2 text-sm dark:border-white">
          
                <span className="font-display font-bold">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">{v}</span>
                <button
            type="button"
            onClick={() => onChange(values.filter((_, idx) => idx !== i))}
            aria-label={`Remove step ${i + 1}`}
            className="focus-brut text-danger">
            
                  <XIcon className="h-4 w-4" strokeWidth={3} />
                </button>
              </li>
        )}
          </ol>)
      }
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          aria-label={label}
          className="brut-input" />
        
        <Button type="button" variant="ink" onClick={add} className="shrink-0">
          <PlusIcon className="h-4 w-4" strokeWidth={3} />
          <span className="sr-only sm:not-sr-only">Add</span>
        </Button>
      </div>
    </div>);

}
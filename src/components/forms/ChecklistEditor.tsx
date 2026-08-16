import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from 'lucide-react';
import type { ChecklistItem } from '../../types';
import { newId } from '../../contexts/StudyForgeContext';
import { Button } from '../ui/Button';

export function ChecklistEditor({
  items,
  onChange,
  label = 'Checklist'




}: {items: ChecklistItem[];onChange: (items: ChecklistItem[]) => void;label?: string;}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChange([...items, { id: newId(), label: value, done: false }]);
    setDraft('');
  };

  return (
    <div>
      <span className="brut-label">{label}</span>
      <ul className="mb-3 space-y-2">
        {items.map((item) =>
        <li key={item.id} className="flex items-center gap-3 border-3 border-ink px-3 py-2 dark:border-white">
            <input
            type="checkbox"
            checked={item.done}
            onChange={(e) =>
            onChange(items.map((i) => i.id === item.id ? { ...i, done: e.target.checked } : i))
            }
            aria-label={`Mark ${item.label} done`}
            className="h-5 w-5 accent-brand focus-brut" />
          
            <span className={item.done ? 'flex-1 text-sm line-through opacity-60' : 'flex-1 text-sm'}>
              {item.label}
            </span>
            <button
            type="button"
            onClick={() => onChange(items.filter((i) => i.id !== item.id))}
            aria-label={`Remove ${item.label}`}
            className="focus-brut text-danger">
            
              <TrashIcon className="h-4 w-4" strokeWidth={3} />
            </button>
          </li>
        )}
      </ul>
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
          placeholder="Add checklist item"
          aria-label="Add checklist item"
          className="brut-input" />
        
        <Button type="button" variant="ink" onClick={add} className="shrink-0">
          <PlusIcon className="h-4 w-4" strokeWidth={3} /> Add
        </Button>
      </div>
    </div>);

}
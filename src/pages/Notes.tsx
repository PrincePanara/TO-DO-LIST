import React, { useMemo, useState } from 'react';
import { NotebookPenIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { FilterTabs, PageHeader, SearchField } from '../components/ui/PageHeader';
import { NoteCard } from '../components/notes/NoteCard';
import type { NoteType } from '../types';

type Tab = 'ALL' | NoteType;

export function Notes() {
  const { notes } = useStudyForge();
  const { open } = useQuickAdd();
  const [tab, setTab] = useState<Tab>('ALL');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () =>
    notes.filter((n) => {
      if (tab !== 'ALL' && n.type !== tab) return false;
      const q = query.trim().toLowerCase();
      const tagsStr = Array.isArray(n.tags) ? n.tags.join(' ') : (typeof n.tags === 'string' ? n.tags : '');
      if (q && !`${n.title || ''} ${n.content || ''} ${tagsStr}`.toLowerCase().includes(q)) return false;
      return true;
    }),
    [notes, query, tab]
  );

  const count = (t: NoteType) => notes.filter((n) => n.type === t).length;

  return (
    <div>
      <PageHeader
        title="My notes"
        subtitle="Lecture notes, revision sheets and exam cheat sheets — searchable by tag."
        actions={<Button onClick={() => open('note')}>+ New note</Button>} />
      

      <div className="mb-6 space-y-4">
        <div className="max-w-xl">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search notes and tags…"
            label="Search notes" />
          
        </div>
        <FilterTabs
          label="Note filters"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'ALL', label: 'All', count: notes.length },
          { value: 'LECTURE', label: 'Lecture', count: count('LECTURE') },
          { value: 'REVISION', label: 'Revision', count: count('REVISION') },
          { value: 'IMPORTANT', label: 'Important', count: count('IMPORTANT') },
          { value: 'EXAM', label: 'Exam', count: count('EXAM') },
          { value: 'IDEAS', label: 'Ideas', count: count('IDEAS') }]
          } />
        
      </div>

      {filtered.length > 0 ?
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((n) =>
        <NoteCard key={n.id} note={n} />
        )}
        </ul> :

      <EmptyState
        icon={<NotebookPenIcon className="h-8 w-8" strokeWidth={3} aria-hidden />}
        title="No notes yet"
        subtitle="Write your first note — lecture summaries, revision sheets or project ideas."
        actions={<Button onClick={() => open('note')}>New note</Button>} />

      }
    </div>);

}
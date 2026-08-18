import React from 'react';
import { Link } from 'react-router-dom';
import type { Note } from '../../types';
import { Card } from '../ui/Card';
import { Badge, type BadgeTone } from '../ui/Badge';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { dueLabel } from '../../utils/date';

const typeTone: Record<Note['type'], BadgeTone> = {
  LECTURE: 'purple',
  REVISION: 'yellow',
  IMPORTANT: 'red',
  EXAM: 'ink',
  IDEAS: 'green'
};

export function NoteCard({ note }: {note: Note;}) {
  const { subject } = useStudyForge();
  const s = subject(note.subjectId);
  const preview = (typeof note.content === 'string' ? note.content : '').
    replace(/[#>*`\-]/g, '').
    split('\n').
    filter(Boolean).
    slice(1, 4).
    join(' ').
    slice(0, 160);

  return (
    <Card as="li" className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold uppercase leading-tight tracking-tight">
          {note.title}
        </h3>
        <Badge tone={typeTone[note.type]}>{note.type}</Badge>
      </div>
      <p className="muted mt-1 text-xs font-bold uppercase tracking-[0.12em]">
        {s?.name ?? 'General'} • Updated {dueLabel(note.updatedAt).toLowerCase()}
      </p>
      <p className="muted mt-3 flex-1 text-sm">{preview || 'Empty note — open it to start writing.'}</p>

      {Array.isArray(note.tags) && note.tags.length > 0 &&
      <p className="mt-4 font-display text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
          {note.tags.join(' • ')}
        </p>
      }

      <Link
        to={`/app/notes/${note.id}`}
        className="mt-4 inline-flex items-center justify-center border-3 border-ink bg-sun px-4 py-2 font-display text-sm font-bold uppercase tracking-[0.08em] text-ink shadow-brut-sm press focus-brut dark:border-white">
        
        Open note
      </Link>
    </Card>);

}
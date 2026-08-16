import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SearchIcon } from 'lucide-react';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { dueLabel } from '../../utils/date';

interface Result {
  id: string;
  group: string;
  title: string;
  meta: string;
  to: string;
}

export function CommandPalette({ open, onClose }: {open: boolean;onClose: () => void;}) {
  const { subjects, tasks, assignments, labs, projects, notes, timetable } = useStudyForge();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setCursor(0);
      window.setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  const subjectName = (id: string | null) => subjects.find((s) => s.id === id)?.name ?? 'General';

  const results = useMemo<Result[]>(() => {
    const all: Result[] = [
    ...subjects.map((s) => ({
      id: s.id,
      group: 'SUBJECTS',
      title: s.name,
      meta: `${s.code} • ${s.credits} credits`,
      to: `/app/subjects/${s.id}`
    })),
    ...tasks.map((t) => ({
      id: t.id,
      group: 'TASKS',
      title: t.title,
      meta: `${subjectName(t.subjectId)} • DUE ${dueLabel(t.dueDate)}`,
      to: '/app/tasks'
    })),
    ...assignments.map((a) => ({
      id: a.id,
      group: 'ASSIGNMENTS',
      title: `Assignment ${String(a.number).padStart(2, '0')} — ${a.title}`,
      meta: `${subjectName(a.subjectId)} • DUE ${dueLabel(a.dueDate)}`,
      to: `/app/assignments/${a.id}`
    })),
    ...labs.map((l) => ({
      id: l.id,
      group: 'LABS',
      title: `Lab ${String(l.number).padStart(2, '0')} — ${l.title}`,
      meta: `${subjectName(l.subjectId)} • DUE ${dueLabel(l.submissionDate)}`,
      to: `/app/labs/${l.id}`
    })),
    ...projects.map((p) => ({
      id: p.id,
      group: 'PROJECTS',
      title: p.name,
      meta: `${p.type === 'MAJOR' ? 'Major project' : 'Mini project'} • DUE ${dueLabel(p.deadline)}`,
      to: `/app/projects/${p.id}`
    })),
    ...notes.map((n) => ({
      id: n.id,
      group: 'NOTES',
      title: n.title,
      meta: `${subjectName(n.subjectId)} • ${n.type}`,
      to: `/app/notes/${n.id}`
    })),
    ...timetable.map((c) => ({
      id: c.id,
      group: 'TIMETABLE',
      title: `${subjectName(c.subjectId)} — ${c.room}`,
      meta: `${c.day} • ${c.start}–${c.end}`,
      to: '/app/timetable'
    }))];

    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 8);
    return all.
    filter((r) => `${r.title} ${r.meta} ${r.group}`.toLowerCase().includes(q)).
    slice(0, 24);
  }, [assignments, labs, notes, projects, query, subjects, tasks, timetable]);

  const grouped = useMemo(() => {
    const map = new Map<string, Result[]>();
    results.forEach((r) => {
      map.set(r.group, [...(map.get(r.group) ?? []), r]);
    });
    return Array.from(map.entries());
  }, [results]);

  const flat = grouped.flatMap(([, items]) => items);

  const go = (r: Result) => {
    onClose();
    navigate(r.to);
  };

  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-[8vh]">
          <motion.button
          aria-label="Close search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="absolute inset-0 bg-ink/60" />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
          initial={{ opacity: 0, y: -16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="relative flex max-h-[76vh] w-full max-w-2xl flex-col surface shadow-brut-lg"
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setCursor((c) => Math.min(c + 1, flat.length - 1));
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              setCursor((c) => Math.max(c - 1, 0));
            }
            if (e.key === 'Enter' && flat[cursor]) {
              e.preventDefault();
              go(flat[cursor]);
            }
          }}>
          
            <div className="flex items-center gap-3 border-b-3 border-ink px-4 py-4 dark:border-white">
              <SearchIcon className="h-6 w-6 shrink-0" strokeWidth={3} aria-hidden />
              <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setCursor(0);
              }}
              placeholder="Search anything…"
              aria-label="Search anything"
              className="w-full bg-transparent font-display text-xl font-bold uppercase tracking-tight placeholder:text-ink/40 focus:outline-none dark:placeholder:text-white/40" />
            
              <kbd className="hidden border-[2px] border-ink px-2 py-0.5 font-display text-[11px] font-bold sm:block dark:border-white">
                ESC
              </kbd>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              {flat.length === 0 ?
            <p className="muted px-3 py-8 text-center font-display text-sm font-bold uppercase tracking-[0.14em]">
                  No matches for “{query}”
                </p> :

            grouped.map(([group, items]) =>
            <section key={group} className="mb-4 last:mb-0">
                    <h3 className="mb-2 px-2 font-display text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                      {group}
                    </h3>
                    <ul className="space-y-1.5">
                      {items.map((r) => {
                  const index = flat.indexOf(r);
                  const active = index === cursor;
                  return (
                    <li key={`${r.group}-${r.id}`}>
                            <button
                        type="button"
                        onMouseEnter={() => setCursor(index)}
                        onClick={() => go(r)}
                        className={`flex w-full items-center justify-between gap-3 border-3 px-3 py-2.5 text-left focus-brut ${
                        active ?
                        'border-ink bg-sun text-ink shadow-brut-xs dark:border-white' :
                        'border-transparent hover:border-ink dark:hover:border-white'}`
                        }>
                        
                              <span className="min-w-0">
                                <span className="block truncate font-display text-sm font-bold uppercase">
                                  {r.title}
                                </span>
                                <span
                            className={`block truncate text-xs ${active ? 'text-ink/70' : 'muted'}`}>
                            
                                  {r.meta}
                                </span>
                              </span>
                              <span className="shrink-0 font-display text-[11px] font-bold uppercase">
                                ↵
                              </span>
                            </button>
                          </li>);

                })}
                    </ul>
                  </section>
            )
            }
            </div>
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}
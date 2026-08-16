import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BoldIcon,
  CheckIcon,
  CodeIcon,
  HeadingIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  PaperclipIcon,
  TrashIcon } from
'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { Card, SectionHeading } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/States';
import { PageHeader } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Field';
import { ListInput } from '../components/forms/ListInput';
import { MarkdownPreview } from '../components/notes/MarkdownPreview';
import type { NoteType } from '../types';
import { isoOffset } from '../utils/date';

const tools: {label: string;icon: React.ElementType;wrap: [string, string];}[] = [
{ label: 'Bold', icon: BoldIcon, wrap: ['**', '**'] },
{ label: 'Italic', icon: ItalicIcon, wrap: ['*', '*'] },
{ label: 'Heading', icon: HeadingIcon, wrap: ['\n## ', ''] },
{ label: 'Bullet list', icon: ListIcon, wrap: ['\n- ', ''] },
{ label: 'Numbered list', icon: ListOrderedIcon, wrap: ['\n1. ', ''] },
{ label: 'Code block', icon: CodeIcon, wrap: ['\n```\n', '\n```\n'] },
{ label: 'Link', icon: LinkIcon, wrap: ['[', '](https://)'] },
{ label: 'Image', icon: ImageIcon, wrap: ['![alt](', ')'] }];


export function NoteEditor() {
  const { noteId = '' } = useParams();
  const { notes, subjects, upsertNote, removeNote, toast } = useStudyForge();
  const navigate = useNavigate();
  const note = notes.find((n) => n.id === noteId);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [saved, setSaved] = useState(true);

  const [draft, setDraft] = useState(note);

  useEffect(() => {
    if (!draft || !note) return;
    if (
    draft.title === note.title &&
    draft.content === note.content &&
    draft.type === note.type &&
    draft.subjectId === note.subjectId &&
    draft.tags.join() === note.tags.join())
    {
      return;
    }
    setSaved(false);
    const id = window.setTimeout(() => {
      upsertNote({ ...draft, updatedAt: isoOffset(0) });
      setSaved(true);
    }, 700);
    return () => window.clearTimeout(id);
  }, [draft, note, upsertNote]);

  if (!note || !draft) {
    return (
      <EmptyState
        title="Note not found"
        subtitle="It may have been deleted."
        actions={
        <Link to="/app/notes">
            <Button>Back to notes</Button>
          </Link>
        } />);


  }

  const applyWrap = ([before, after]: [string, string]) => {
    const el = areaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = draft.content;
    const selected = value.slice(start, end) || 'text';
    const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    setDraft({ ...draft, content: next });
    window.setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  return (
    <div>
      <PageHeader
        backTo="/app/notes"
        backLabel="All notes"
        eyebrow={
        <>
            <Badge tone={saved ? 'green' : 'yellow'}>
              {saved ?
            <>
                  <CheckIcon className="h-3 w-3" strokeWidth={4} aria-hidden /> Saved
                </> :

            'Saving…'
            }
            </Badge>
            <Badge tone="purple">{draft.type}</Badge>
          </>
        }
        title="Note editor"
        actions={
        <Button
          variant="danger"
          onClick={() => {
            removeNote(note.id);
            toast('Note deleted', 'error');
            navigate('/app/notes');
          }}>
          
            <TrashIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Delete
          </Button>
        } />
      

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="p-5">
          <label className="brut-label" htmlFor="note-title">
            Title
          </label>
          <input
            id="note-title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="brut-input mb-5 font-display text-xl font-bold uppercase tracking-tight" />
          

          <div className="mb-5 grid gap-5 sm:grid-cols-2">
            <Select
              label="Subject"
              value={draft.subjectId ?? ''}
              onChange={(e) => setDraft({ ...draft, subjectId: e.target.value || null })}
              options={[
              { value: '', label: 'No subject' },
              ...subjects.map((s) => ({ value: s.id, label: s.name }))]
              } />
            
            <Select
              label="Note type"
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as NoteType })}
              options={[
              { value: 'LECTURE', label: 'Lecture' },
              { value: 'REVISION', label: 'Revision' },
              { value: 'IMPORTANT', label: 'Important' },
              { value: 'EXAM', label: 'Exam' },
              { value: 'IDEAS', label: 'Ideas' }]
              } />
            
          </div>

          <div className="mb-3">
            <ListInput
              label="Tags"
              values={draft.tags}
              onChange={(tags) => setDraft({ ...draft, tags })}
              placeholder="Add tag" />
            
          </div>

          <span className="brut-label">Content</span>
          <div className="mb-2 flex flex-wrap gap-2">
            {tools.map((t) =>
            <button
              key={t.label}
              type="button"
              onClick={() => applyWrap(t.wrap)}
              aria-label={t.label}
              title={t.label}
              className="flex h-9 w-9 items-center justify-center border-3 border-ink bg-white press focus-brut dark:border-white dark:bg-white/5">
              
                <t.icon className="h-4 w-4" strokeWidth={3} aria-hidden />
              </button>
            )}
            <button
              type="button"
              aria-label="Attach file"
              title="Attach file"
              onClick={() => toast('Attachment added ✓')}
              className="flex h-9 w-9 items-center justify-center border-3 border-ink bg-sun press focus-brut dark:border-white">
              
              <PaperclipIcon className="h-4 w-4 text-ink" strokeWidth={3} aria-hidden />
            </button>
          </div>
          <textarea
            ref={areaRef}
            value={draft.content}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            rows={18}
            aria-label="Note content, markdown supported"
            placeholder="# Heading&#10;&#10;- bullet&#10;**bold** and `code`"
            className="brut-input font-mono text-sm" />
          
          <p className="muted mt-2 text-xs">
            Markdown supported — headings, lists, bold, italics, quotes and code fences.
          </p>
        </Card>

        <Card className="h-fit p-5">
          <SectionHeading title="Preview" hint="Exactly how this note will read while revising." />
          <MarkdownPreview content={draft.content} />
        </Card>
      </div>
    </div>);

}
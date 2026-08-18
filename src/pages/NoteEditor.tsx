import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BoldIcon,
  CheckIcon,
  CodeIcon,
  DownloadIcon,
  HeadingIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  PaperclipIcon,
  ShareIcon,
  SigmaIcon,
  TableIcon,
  TrashIcon } from
'lucide-react';
import html2pdf from 'html2pdf.js';
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
{ label: 'Link', icon: LinkIcon, wrap: ['[', '](https://)'] }];


export function NoteEditor() {
  const { noteId = '' } = useParams();
  const { notes, subjects, upsertNote, removeNote, toast } = useStudyForge();
  const navigate = useNavigate();
  const note = notes.find((n) => n.id === noteId);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [saved, setSaved] = useState(true);

  const [draft, setDraft] = useState(note);
  const [tablePopup, setTablePopup] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [sharePopup, setSharePopup] = useState(false);

  const [inviteUid, setInviteUid] = useState('');

  const [symbolsPopup, setSymbolsPopup] = useState(false);
  const symbolsData = {
    Mathematical: ['π', '∞', '√', '∑', '∫', '∂', '∆', '∇', '≈', '≠', '≤', '≥', '±', '×', '÷', '∝'],
    Greek: ['α', 'β', 'γ', 'δ', 'θ', 'λ', 'μ', 'σ', 'φ', 'ω', 'Δ', 'Ω', 'Σ', 'Φ'],
    Logic: ['∈', '∉', '⊂', '⊃', '∪', '∩', '∀', '∃', '¬', '∧', '∨', '⇒', '⇔'],
    Arrows: ['→', '←', '↑', '↓', '↔', '⇒', '⇐', '⇑', '⇓'],
    Common: ['©', '®', '™', '°', '•', '†', '‡', '§', '¶', '✓', '✗']
  };
  type SymbolCategory = keyof typeof symbolsData;
  const [symbolTab, setSymbolTab] = useState<SymbolCategory>('Mathematical');

  const insertSymbol = (char: string) => {
    applyWrap([char, '']);
    setSymbolsPopup(false);
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('pdf-content');
    if (!element) return;
    const opt = {
      margin: 10,
      filename: `${draft?.title || 'note'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
    toast('PDF Download started', 'info');
  };

  const insertTable = () => {
    let md = '\n';
    md += '|' + Array(tableCols).fill(' Header ').join('|') + '|\n';
    md += '|' + Array(tableCols).fill('---').join('|') + '|\n';
    for (let i = 0; i < tableRows; i++) {
      md += '|' + Array(tableCols).fill(' Cell ').join('|') + '|\n';
    }
    md += '\n';
    applyWrap([md, '']);
    setTablePopup(false);
  };

  const handleInvite = () => {
    if (!draft || !inviteUid.trim()) return;
    const current = draft.collaborators || [];
    if (!current.includes(inviteUid.trim())) {
      setDraft({ ...draft, shared: true, collaborators: [...current, inviteUid.trim()] });
      toast('Collaborator invited!', 'success');
    }
    setInviteUid('');
  };

  const removeCollaborator = (uid: string) => {
    if (!draft) return;
    const current = draft.collaborators || [];
    const next = current.filter(id => id !== uid);
    setDraft({ ...draft, collaborators: next, shared: next.length > 0 });
    toast('Collaborator removed.', 'info');
  };

  useEffect(() => {
    if (!draft || !note) return;
    if (
    draft.title === note.title &&
    draft.content === note.content &&
    draft.type === note.type &&
    draft.subjectId === note.subjectId &&
    draft.tags.join() === note.tags.join() &&
    draft.shared === note.shared &&
    (draft.collaborators || []).join() === (note.collaborators || []).join())
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
        } />
    );
  }

  const applyWrap = ([before, after]: [string, string], perLine: boolean = false) => {
    const el = areaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const value = draft.content;
    const selected = value.slice(start, end) || 'text';
    
    let replacement = '';
    if (perLine && selected.includes('\n')) {
      replacement = selected.split('\n').map(line => line.trim() ? `${before}${line}${after}` : line).join('\n');
    } else {
      replacement = `${before}${selected}${after}`;
    }

    const next = `${value.slice(0, start)}${replacement}${value.slice(end)}`;
    setDraft({ ...draft, content: next });
    window.setTimeout(() => {
      el.focus();
      el.setSelectionRange(start, start + replacement.length);
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

            'Saving…'}

            </Badge>
            <Badge tone="purple">{draft.type}</Badge>
          </>}

        title="Note editor"
        actions={
        <div className="flex items-center gap-2">
            <Button
            variant="secondary"
            onClick={handleDownloadPdf}>
              <DownloadIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Download PDF
            </Button>
            <Button
            variant={draft.shared ? "primary" : "secondary"}
            onClick={() => setSharePopup(true)}>
              <ShareIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> {draft.shared ? 'Shared' : 'Collaborate'}
            </Button>
            <Button
            variant="danger"
            onClick={() => {
              removeNote(note.id);
              toast('Note deleted', 'error');
              navigate('/app/notes');
            }}>
              <TrashIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Delete
            </Button>
          </div>} />
      

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
            ...subjects.map((s) => ({ value: s.id, label: s.name }))]} />
            
            <Select
            label="Note type"
            value={draft.type}
            onChange={(e) => setDraft({ ...draft, type: e.target.value as NoteType })}
            options={[
            { value: 'LECTURE', label: 'Lecture' },
            { value: 'REVISION', label: 'Revision' },
            { value: 'IMPORTANT', label: 'Important' },
            { value: 'EXAM', label: 'Exam' },
            { value: 'IDEAS', label: 'Ideas' }]} />
            
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
            <div className="relative">
              <button
                type="button"
                aria-label="Insert Table"
                title="Insert Table"
                onClick={() => setTablePopup(!tablePopup)}
                className="flex h-9 w-9 items-center justify-center border-3 border-ink bg-sun press focus-brut dark:border-white">
                <TableIcon className="h-4 w-4 text-ink" strokeWidth={3} aria-hidden />
              </button>
              {tablePopup && (
                <div className="absolute top-10 left-0 z-10 w-48 border-3 border-ink bg-white p-3 shadow-brut dark:border-white dark:bg-ink">
                  <span className="mb-2 block font-bold text-sm">Insert Table</span>
                  <div className="mb-2 flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs">Rows</label>
                      <input type="number" min="1" max="20" value={tableRows} onChange={e => setTableRows(parseInt(e.target.value) || 1)} className="brut-input w-full p-1 text-sm" />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs">Cols</label>
                      <input type="number" min="1" max="20" value={tableCols} onChange={e => setTableCols(parseInt(e.target.value) || 1)} className="brut-input w-full p-1 text-sm" />
                    </div>
                  </div>
                  <Button onClick={insertTable} className="w-full justify-center">Insert</Button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label="Insert Symbol"
                title="Insert Symbol"
                onClick={() => setSymbolsPopup(!symbolsPopup)}
                className="flex h-9 w-9 items-center justify-center border-3 border-ink bg-sun press focus-brut dark:border-white">
                <SigmaIcon className="h-4 w-4 text-ink" strokeWidth={3} aria-hidden />
              </button>
              {symbolsPopup && (
                <div className="absolute top-10 left-0 z-10 w-80 border-3 border-ink bg-white p-3 shadow-brut dark:border-white dark:bg-ink z-50">
                  <span className="mb-2 block font-bold text-sm">Symbols</span>
                  <div className="mb-3 flex flex-wrap gap-1 border-b-2 border-ink pb-2 dark:border-white">
                    {(Object.keys(symbolsData) as SymbolCategory[]).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSymbolTab(cat)}
                        className={`px-2 py-1 text-xs font-bold ${symbolTab === cat ? 'bg-ink text-white dark:bg-white dark:text-ink' : 'hover:bg-ink/10 dark:hover:bg-white/10'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {symbolsData[symbolTab].map(sym => (
                      <button
                        key={sym}
                        onClick={() => insertSymbol(sym)}
                        className="flex h-8 w-8 items-center justify-center border-2 border-ink bg-sun/20 text-sm font-bold hover:bg-brand hover:text-white dark:border-white"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
          <div id="pdf-content" className="p-2 bg-white dark:bg-ink rounded-md">
            <MarkdownPreview content={draft.content} />
          </div>
        </Card>
      </div>

      {sharePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="mb-2 font-display text-2xl font-bold uppercase tracking-tight">Collaborate</h2>
            <p className="mb-6 text-sm">Invite a friend to collaborate on this note using their UID.</p>
            
            <div className="mb-4 flex gap-2">
              <input 
                placeholder="Enter friend's UID"
                value={inviteUid}
                onChange={e => setInviteUid(e.target.value)}
                className="brut-input flex-1 p-2 text-sm" 
              />
              <Button onClick={handleInvite}>Invite</Button>
            </div>

            {draft.collaborators && draft.collaborators.length > 0 && (
              <div className="mb-4">
                <span className="block text-xs font-bold mb-2">Current Collaborators:</span>
                <ul className="space-y-2">
                  {draft.collaborators.map(uid => (
                    <li key={uid} className="flex items-center justify-between bg-sun/20 p-2 text-sm border-2 border-ink dark:border-white">
                      <span className="font-mono">{uid}</span>
                      <button onClick={() => removeCollaborator(uid)} className="text-red-500 hover:underline">Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t-2 border-ink dark:border-white">
              <Button variant="secondary" onClick={() => setSharePopup(false)}>Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>);
}
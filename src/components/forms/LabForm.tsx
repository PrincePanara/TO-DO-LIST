import React, { useState } from 'react';
import type { ChecklistItem, LabWork, VivaQuestion, SubjectColor } from '../../types';
import { newId, useStudyForge } from '../../contexts/StudyForgeContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select, TextArea, TextInput } from '../ui/Field';
import { ChecklistEditor } from './ChecklistEditor';
import { ListInput } from './ListInput';
import { isoOffset } from '../../utils/date';

const defaultChecklist = (): ChecklistItem[] =>
[
'Understand experiment',
'Write code',
'Run program',
'Capture output',
'Prepare viva',
'Submit'].
map((label) => ({ id: newId(), label, done: false }));

const colors: {value: SubjectColor;label: string;swatch: string;}[] = [
  { value: 'purple', label: 'Purple', swatch: 'bg-brand' },
  { value: 'yellow', label: 'Yellow', swatch: 'bg-sun' },
  { value: 'red', label: 'Red', swatch: 'bg-danger' },
  { value: 'green', label: 'Green', swatch: 'bg-ok' },
  { value: 'white', label: 'White', swatch: 'bg-white' }
];

export function LabForm({
  open,
  onClose,
  editing,
  presetSubjectId





}: {open: boolean;onClose: () => void;editing?: LabWork;presetSubjectId?: string;}) {
  const { subjects, upsertLab, toast } = useStudyForge();
  const labSubjects = subjects.filter((s) => s.lab);
  const [number, setNumber] = useState(String(editing?.number ?? 1));
  const [title, setTitle] = useState(editing?.title ?? '');
  const [subjectId, setSubjectId] = useState(
    editing?.subjectId ?? presetSubjectId ?? labSubjects[0]?.id ?? subjects[0]?.id ?? ''
  );
  const [objective, setObjective] = useState(editing?.objective ?? '');
  const [theory, setTheory] = useState(editing?.theory ?? '');
  const [requirements, setRequirements] = useState<string[]>(editing?.requirements ?? []);
  const [procedure, setProcedure] = useState<string[]>(editing?.procedure ?? []);
  const [code, setCode] = useState(editing?.code ?? '');
  const [output, setOutput] = useState(editing?.output ?? '');
  const [viva, setViva] = useState<VivaQuestion[]>(editing?.viva ?? []);
  const [vivaDraft, setVivaDraft] = useState({ question: '', answer: '' });
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [submissionDate, setSubmissionDate] = useState(editing?.submissionDate ?? isoOffset(5));
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    editing?.checklist ?? defaultChecklist()
  );
  const [attachments, setAttachments] = useState<string[]>(editing?.attachments ?? []);
  const [color, setColor] = useState<SubjectColor>(editing?.color ?? 'purple');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Experiment name is required');
      return;
    }
    upsertLab({
      id: editing?.id ?? newId(),
      number: Number(number) || 1,
      title: title.trim(),
      subjectId,
      objective,
      theory,
      requirements,
      procedure,
      code,
      output,
      viva,
      notes,
      submissionDate,
      status: editing?.status ?? 'NOT_STARTED',
      checklist,
      attachments,
      color
    });
    toast(editing ? 'Lab work saved ✓' : 'Lab work created ✓');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Lab Work' : 'Add Lab Work'}
      subtitle="Objective, code, output and viva — recorded once."
      footer={
      <>
          <Button variant="white" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button form="lab-form" type="submit">
            Save Lab Work
          </Button>
        </>
      }>
      
      <form id="lab-form" onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
          <TextInput
            label="Lab no."
            type="number"
            min={1}
            value={number}
            onChange={(e) => setNumber(e.target.value)} />
          
          <TextInput
            label="Experiment name"
            placeholder="e.g. File Handling"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            error={error}
            required />
          
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={subjects.map((s) => ({ value: s.id, label: `${s.code} — ${s.name}` }))} />
          
          <TextInput
            label="Submission date"
            type="date"
            value={submissionDate}
            onChange={(e) => setSubmissionDate(e.target.value)} />
          
        </div>
        <TextArea
          label="Objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          rows={2} />
        
        <TextArea label="Theory" value={theory} onChange={(e) => setTheory(e.target.value)} />
        <ListInput label="Requirements" values={requirements} onChange={setRequirements} />
        <ListInput
          label="Procedure"
          values={procedure}
          onChange={setProcedure}
          chips={false}
          placeholder="Add a step" />
        
        <TextArea
          label="Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
          className="font-mono text-sm" />
        
        <TextArea
          label="Output"
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          rows={3}
          className="font-mono text-sm" />
        
        <div>
          <span className="brut-label">Viva questions</span>
          <ul className="mb-3 space-y-2">
            {viva.map((v) =>
            <li key={v.id} className="border-3 border-ink px-3 py-2 dark:border-white">
                <p className="font-display text-sm font-bold">{v.question}</p>
                <p className="muted text-sm">{v.answer}</p>
                <button
                type="button"
                onClick={() => setViva(viva.filter((x) => x.id !== v.id))}
                className="mt-1 font-display text-[11px] font-bold uppercase text-danger focus-brut">
                
                  Remove
                </button>
              </li>
            )}
          </ul>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              className="brut-input"
              placeholder="Question"
              aria-label="Viva question"
              value={vivaDraft.question}
              onChange={(e) => setVivaDraft({ ...vivaDraft, question: e.target.value })} />
            
            <input
              className="brut-input"
              placeholder="Answer"
              aria-label="Viva answer"
              value={vivaDraft.answer}
              onChange={(e) => setVivaDraft({ ...vivaDraft, answer: e.target.value })} />
            
          </div>
          <Button
            type="button"
            variant="ink"
            className="mt-3"
            onClick={() => {
              if (!vivaDraft.question.trim()) return;
              setViva([...viva, { id: newId(), ...vivaDraft }]);
              setVivaDraft({ question: '', answer: '' });
            }}>
            
            Add question
          </Button>
        </div>
        <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        <ChecklistEditor items={checklist} onChange={setChecklist} />
        <div>
          <span className="brut-label">Attachments</span>
          <input
            type="file"
            multiple
            aria-label="Attachments"
            onChange={(e) => setAttachments(Array.from(e.target.files ?? []).map((f) => f.name))}
            className="brut-input file:mr-3 file:border-3 file:border-ink file:bg-sun file:px-3 file:py-1 file:font-display file:text-xs file:font-bold file:uppercase" />
          
          {attachments.length > 0 && <p className="muted mt-2 text-xs">{attachments.join(', ')}</p>}
        </div>
        
        <div>
          <span className="brut-label">Card colour</span>
          <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Card colour">
            {colors.map((c) =>
            <button
              key={c.value}
              type="button"
              role="radio"
              aria-checked={color === c.value}
              aria-label={c.label}
              onClick={() => setColor(c.value)}
              className={`h-11 w-11 border-3 border-ink press focus-brut dark:border-white ${c.swatch} ${
              color === c.value ? 'shadow-brut-sm ring-4 ring-ink/30' : ''}`
              } />
            )}
          </div>
        </div>
      </form>
    </Modal>);

}
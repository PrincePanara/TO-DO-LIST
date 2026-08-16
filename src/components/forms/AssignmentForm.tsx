import React, { useState } from 'react';
import type { Assignment, ChecklistItem, Priority } from '../../types';
import { newId, useStudyForge } from '../../contexts/StudyForgeContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ChipGroup, Select, TextArea, TextInput, Toggle } from '../ui/Field';
import { ChecklistEditor } from './ChecklistEditor';
import { ListInput } from './ListInput';
import { isoOffset } from '../../utils/date';

const defaultChecklist = (): ChecklistItem[] =>
['Read questions', 'Research', 'Write answer', 'Review', 'Submit'].map((label) => ({
  id: newId(),
  label,
  done: false
}));

const priorities: {value: Priority;label: string;}[] = [
{ value: 'URGENT', label: 'Urgent' },
{ value: 'IMPORTANT', label: 'Important' },
{ value: 'NORMAL', label: 'Normal' }];


export function AssignmentForm({
  open,
  onClose,
  editing,
  presetSubjectId





}: {open: boolean;onClose: () => void;editing?: Assignment;presetSubjectId?: string;}) {
  const { subjects, upsertAssignment, toast } = useStudyForge();
  const [number, setNumber] = useState(String(editing?.number ?? 1));
  const [title, setTitle] = useState(editing?.title ?? '');
  const [subjectId, setSubjectId] = useState(
    editing?.subjectId ?? presetSubjectId ?? subjects[0]?.id ?? ''
  );
  const [description, setDescription] = useState(editing?.description ?? '');
  const [instructions, setInstructions] = useState(editing?.instructions ?? '');
  const [dueDate, setDueDate] = useState(editing?.dueDate ?? isoOffset(7));
  const [dueTime, setDueTime] = useState(editing?.dueTime ?? '16:00');
  const [priority, setPriority] = useState<Priority>(editing?.priority ?? 'IMPORTANT');
  const [hours, setHours] = useState('3');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    editing?.checklist ?? defaultChecklist()
  );
  const [notes, setNotes] = useState(editing?.notes ?? '');
  const [links, setLinks] = useState<string[]>(editing?.links ?? []);
  const [attachments, setAttachments] = useState<string[]>(editing?.attachments ?? []);
  const [reminder, setReminder] = useState(true);
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    upsertAssignment({
      id: editing?.id ?? newId(),
      number: Number(number) || 1,
      title: title.trim(),
      subjectId,
      description,
      instructions,
      dueDate,
      dueTime,
      priority,
      status: editing?.status ?? 'NOT_STARTED',
      checklist,
      notes,
      attachments,
      links,
      submitted: editing?.submitted ?? false
    });
    toast(editing ? 'Assignment saved ✓' : 'Assignment created ✓');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Assignment' : 'Add Assignment'}
      subtitle={`Estimated effort ${hours} hours`}
      footer={
      <>
          <Button variant="white" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button form="assignment-form" type="submit">
            Save Assignment
          </Button>
        </>
      }>
      
      <form id="assignment-form" onSubmit={submit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-[120px_1fr]">
          <TextInput
            label="No."
            type="number"
            min={1}
            value={number}
            onChange={(e) => setNumber(e.target.value)} />
          
          <TextInput
            label="Title"
            placeholder="e.g. Python Functions"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            error={error}
            required />
          
        </div>
        <Select
          label="Subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          options={subjects.map((s) => ({ value: s.id, label: `${s.code} — ${s.name}` }))} />
        
        <TextArea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)} />
        
        <TextArea
          label="Instructions"
          hint="Submission format, page limit, anything the teacher insisted on."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          rows={3} />
        
        <div className="grid gap-5 sm:grid-cols-3">
          <TextInput
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)} />
          
          <TextInput
            label="Due time"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)} />
          
          <TextInput
            label="Estimated time (hours)"
            type="number"
            min={0}
            step={0.5}
            value={hours}
            onChange={(e) => setHours(e.target.value)} />
          
        </div>
        <ChipGroup label="Priority" value={priority} options={priorities} onChange={setPriority} />
        <ChecklistEditor items={checklist} onChange={setChecklist} />
        <TextArea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
        <ListInput
          label="Reference links"
          values={links}
          onChange={setLinks}
          placeholder="https://…" />
        
        <div>
          <span className="brut-label">Attachments</span>
          <input
            type="file"
            multiple
            aria-label="Attachments"
            onChange={(e) =>
            setAttachments(Array.from(e.target.files ?? []).map((f) => f.name))
            }
            className="brut-input file:mr-3 file:border-3 file:border-ink file:bg-sun file:px-3 file:py-1 file:font-display file:text-xs file:font-bold file:uppercase" />
          
          {attachments.length > 0 && <p className="muted mt-2 text-xs">{attachments.join(', ')}</p>}
        </div>
        <Toggle
          label="Reminder"
          description="Alert me 24 hours before the deadline"
          checked={reminder}
          onChange={setReminder} />
        
      </form>
    </Modal>);

}
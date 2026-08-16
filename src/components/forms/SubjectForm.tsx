import React, { useState } from 'react';
import { FileTextIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Subject, SubjectColor } from '../../types';
import { newId, useStudyForge } from '../../contexts/StudyForgeContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select, TextArea, TextInput } from '../ui/Field';

const colors: {value: SubjectColor;label: string;swatch: string;}[] = [
{ value: 'purple', label: 'Purple', swatch: 'bg-brand' },
{ value: 'yellow', label: 'Yellow', swatch: 'bg-sun' },
{ value: 'red', label: 'Red', swatch: 'bg-danger' },
{ value: 'green', label: 'Green', swatch: 'bg-ok' },
{ value: 'white', label: 'White', swatch: 'bg-white' }];


export function SubjectForm({
  open,
  onClose,
  editing




}: {open: boolean;onClose: () => void;editing?: Subject;}) {
  const { upsertSubject, toast } = useStudyForge();
  const navigate = useNavigate();
  const [name, setName] = useState(editing?.name ?? '');
  const [code, setCode] = useState(editing?.code ?? '');
  const [credits, setCredits] = useState(String(editing?.credits ?? 4));
  const [units, setUnits] = useState(String(editing?.units ?? 5));
  const [teacher, setTeacher] = useState(editing?.teacher ?? '');
  const [kind, setKind] = useState(
    editing ? editing.theory && editing.lab ? 'BOTH' : editing.lab ? 'LAB' : 'THEORY' : 'BOTH'
  );
  const [description, setDescription] = useState(editing?.description ?? '');
  const [color, setColor] = useState<SubjectColor>(editing?.color ?? 'purple');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Subject name is required');
      return;
    }
    upsertSubject({
      id: editing?.id ?? newId(),
      name: name.trim(),
      code: code.trim() || 'GEN000',
      credits: Number(credits) || 0,
      units: Number(units) || 0,
      teacher: teacher.trim(),
      theory: kind !== 'LAB',
      lab: kind !== 'THEORY',
      description,
      color
    });
    toast(editing ? 'Subject updated ✓' : 'Subject created ✓');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Edit Subject' : 'Add Subject'}
      subtitle="Add one manually, or import your whole syllabus at once."
      width="md"
      footer={
      <>
          <Button variant="white" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button form="subject-form" type="submit">
            {editing ? 'Save Subject' : 'Create Subject'}
          </Button>
        </>
      }>
      
      {!editing &&
      <button
        type="button"
        onClick={() => {
          onClose();
          navigate('/import');
        }}
        className="mb-6 flex w-full items-center gap-4 border-3 border-dashed border-ink bg-sun-soft px-4 py-4 text-left press focus-brut dark:border-white dark:bg-white/5">
        
          <span className="flex h-11 w-11 shrink-0 items-center justify-center border-3 border-ink bg-brand text-white dark:border-white">
            <FileTextIcon className="h-5 w-5" strokeWidth={3} />
          </span>
          <span>
            <span className="block font-display text-sm font-bold uppercase tracking-[0.08em]">
              Import from syllabus PDF
            </span>
            <span className="muted block text-xs">Detect every subject, code, credit and unit</span>
          </span>
        </button>
      }
      <form id="subject-form" onSubmit={submit} className="space-y-5">
        <TextInput
          label="Subject name"
          placeholder="e.g. Python Programming"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
          required />
        
        <div className="grid gap-5 sm:grid-cols-3">
          <TextInput
            label="Subject code"
            placeholder="CS301"
            value={code}
            onChange={(e) => setCode(e.target.value)} />
          
          <TextInput
            label="Credits"
            type="number"
            min={0}
            value={credits}
            onChange={(e) => setCredits(e.target.value)} />
          
          <TextInput
            label="Units"
            type="number"
            min={0}
            value={units}
            onChange={(e) => setUnits(e.target.value)} />
          
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextInput
            label="Teacher"
            placeholder="Prof. A. Sharma"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)} />
          
          <Select
            label="Type"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            options={[
            { value: 'BOTH', label: 'Theory + Lab' },
            { value: 'THEORY', label: 'Theory only' },
            { value: 'LAB', label: 'Lab only' }]
            } />
          
        </div>
        <TextArea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3} />
        
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
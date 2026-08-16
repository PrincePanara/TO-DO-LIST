import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { TextInput } from '../../components/ui/Field';
import { detectedFromPdf } from '../../data/seed';
import { newId, useStudyForge } from '../../contexts/StudyForgeContext';
import type { Subject, SubjectColor } from '../../types';

interface Row {
  id: string;
  name: string;
  code: string;
  credits: number;
  units: number;
  theory: boolean;
  lab: boolean;
  selected: boolean;
}

const palette: SubjectColor[] = ['purple', 'yellow', 'white', 'red', 'green', 'white'];

export function DetectedSubjects() {
  const navigate = useNavigate();
  const { addSubjects, toast, setOnboarded } = useStudyForge();
  const [rows, setRows] = useState<Row[]>(
    detectedFromPdf.map((d, i) => ({ id: `d${i}`, ...d, selected: i < 6 }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  const selectedCount = rows.filter((r) => r.selected).length;

  const update = (id: string, patch: Partial<Row>) =>
  setRows((prev) => prev.map((r) => r.id === id ? { ...r, ...patch } : r));

  const createWorkspace = () => {
    const picked = rows.filter((r) => r.selected);
    if (picked.length === 0) return;
    const subjects: Subject[] = picked.map((r, i) => ({
      id: newId(),
      name: r.name,
      code: r.code,
      credits: r.credits,
      units: r.units,
      teacher: '',
      theory: r.theory,
      lab: r.lab,
      description: '',
      color: palette[i % palette.length]
    }));
    addSubjects(subjects);
    setOnboarded(true);
    toast(`${subjects.length} subjects added ✓`);
    navigate('/app/dashboard');
  };

  return (
    <OnboardingShell step="Review detection">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight sm:text-5xl">
          We found your subjects
        </h1>
        <p className="muted mt-4 text-base">
          Review everything before creating your academic workspace. Nothing is created until you
          confirm.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button
          variant="white"
          size="sm"
          onClick={() => setRows((prev) => prev.map((r) => ({ ...r, selected: true })))}>
          
          Select all
        </Button>
        <Button
          variant="white"
          size="sm"
          onClick={() => setRows((prev) => prev.map((r) => ({ ...r, selected: false })))}>
          
          Clear all
        </Button>
        <Button
          variant="ink"
          size="sm"
          onClick={() =>
          setRows((prev) => [
          ...prev,
          {
            id: newId(),
            name: 'New subject',
            code: 'NEW000',
            credits: 3,
            units: 5,
            theory: true,
            lab: false,
            selected: true
          }]
          )
          }>
          
          <PlusIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Add subject
        </Button>
      </div>

      <ul className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) =>
        <li key={r.id}>
            <Card
            tone={r.selected ? 'white' : 'white'}
            shadow={r.selected ? 'md' : 'none'}
            className={`flex h-full flex-col p-5 ${r.selected ? '' : 'opacity-60'}`}>
            
              <div className="flex items-start justify-between gap-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                  type="checkbox"
                  checked={r.selected}
                  onChange={(e) => update(r.id, { selected: e.target.checked })}
                  aria-label={`Include ${r.name}`}
                  className="mt-1 h-5 w-5 accent-brand focus-brut" />
                
                  <span>
                    {editingId === r.id ?
                  <TextInput
                    label="Subject name"
                    value={r.name}
                    onChange={(e) => update(r.id, { name: e.target.value })} /> :


                  <span className="block font-display text-lg font-bold uppercase leading-tight tracking-tight">
                        {r.name}
                      </span>
                  }
                  </span>
                </label>
                <div className="flex shrink-0 gap-1.5">
                  <button
                  type="button"
                  aria-label={`Edit ${r.name}`}
                  onClick={() => setEditingId(editingId === r.id ? null : r.id)}
                  className="flex h-8 w-8 items-center justify-center border-3 border-ink press focus-brut dark:border-white">
                  
                    <PencilIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </button>
                  <button
                  type="button"
                  aria-label={`Remove ${r.name}`}
                  onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                  className="flex h-8 w-8 items-center justify-center border-3 border-ink bg-danger text-white press focus-brut dark:border-white">
                  
                    <TrashIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                  </button>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-3 gap-2 border-y-3 border-ink py-3 dark:border-white">
                <div>
                  <dt className="muted font-display text-[10px] font-bold uppercase tracking-[0.14em]">
                    Code
                  </dt>
                  <dd className="font-mono text-sm font-bold">{r.code}</dd>
                </div>
                <div>
                  <dt className="muted font-display text-[10px] font-bold uppercase tracking-[0.14em]">
                    Credits
                  </dt>
                  <dd className="font-mono text-sm font-bold">{r.credits}</dd>
                </div>
                <div>
                  <dt className="muted font-display text-[10px] font-bold uppercase tracking-[0.14em]">
                    Units
                  </dt>
                  <dd className="font-mono text-sm font-bold">{r.units}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                {r.theory && <Badge tone="purple">Theory</Badge>}
                {r.lab && <Badge tone="yellow">Lab</Badge>}
              </div>
            </Card>
          </li>
        )}
      </ul>

      <div className="sticky bottom-4 mt-8 flex flex-wrap items-center justify-between gap-4 border-3 border-ink bg-white px-5 py-4 shadow-brut dark:border-white dark:bg-[#232228]">
        <p className="font-display text-lg font-bold uppercase tracking-tight">
          {selectedCount} subject{selectedCount === 1 ? '' : 's'} selected
        </p>
        <Button size="lg" onClick={createWorkspace} disabled={selectedCount === 0}>
          Create workspace <ArrowRightIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
        </Button>
      </div>
    </OnboardingShell>);

}
import React, { useMemo, useState } from 'react';
import { FlaskConicalIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/States';
import { FilterTabs, PageHeader, SearchField } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Field';
import { LabCard } from '../components/labs/LabCard';
import { isOverdue } from '../utils/date';
import { completionRate } from '../utils/progress';

type Tab = 'ALL' | 'OPEN' | 'OVERDUE' | 'COMPLETED';

export function LabWorkPage() {
  const { labs, subjects } = useStudyForge();
  const { open } = useQuickAdd();
  const [tab, setTab] = useState<Tab>('ALL');
  const [query, setQuery] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const filtered = useMemo(
    () =>
    labs.filter((l) => {
      if (subjectId && l.subjectId !== subjectId) return false;
      const q = query.trim().toLowerCase();
      if (q && !`${l.title} ${l.objective}`.toLowerCase().includes(q)) return false;
      if (tab === 'OPEN') return l.status !== 'COMPLETED';
      if (tab === 'OVERDUE') return l.status !== 'COMPLETED' && isOverdue(l.submissionDate);
      if (tab === 'COMPLETED') return l.status === 'COMPLETED';
      return true;
    }),
    [labs, query, subjectId, tab]
  );

  return (
    <div>
      <PageHeader
        title="Lab work"
        subtitle="Experiments, code, output and viva preparation — one record per lab."
        actions={<Button onClick={() => open('lab')}>+ Add lab work</Button>} />
      

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_260px_260px]">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search experiments…"
          label="Search experiments" />
        
        <Select
          label="Subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          options={[
          { value: '', label: 'All subjects' },
          ...subjects.filter((s) => s.lab).map((s) => ({ value: s.id, label: s.name }))]
          } />
        
        <Card tone="purple" className="flex items-center justify-between px-4 py-3" shadow="sm">
          <span className="font-display text-xs font-bold uppercase tracking-[0.12em]">
            Lab completion
          </span>
          <span className="font-display text-2xl font-bold leading-none">{completionRate(labs)}%</span>
        </Card>
      </div>

      <div className="mb-6">
        <FilterTabs
          label="Lab filters"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'ALL', label: 'All', count: labs.length },
          { value: 'OPEN', label: 'Open', count: labs.filter((l) => l.status !== 'COMPLETED').length },
          {
            value: 'OVERDUE',
            label: 'Overdue',
            count: labs.filter((l) => l.status !== 'COMPLETED' && isOverdue(l.submissionDate)).length
          },
          {
            value: 'COMPLETED',
            label: 'Completed',
            count: labs.filter((l) => l.status === 'COMPLETED').length
          }]
          } />
        
      </div>

      {filtered.length > 0 ?
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((l) =>
        <LabCard key={l.id} lab={l} />
        )}
        </ul> :

      <EmptyState
        icon={<FlaskConicalIcon className="h-8 w-8" strokeWidth={3} aria-hidden />}
        title="No lab work here"
        subtitle="Record an experiment, or clear the filters to see everything."
        actions={<Button onClick={() => open('lab')}>Add lab work</Button>} />

      }
    </div>);

}
import React, { useMemo, useState } from 'react';
import { ClipboardListIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/States';
import { FilterTabs, PageHeader, SearchField } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Field';
import { AssignmentCard } from '../components/classwork/AssignmentCard';
import { isOverdue } from '../utils/date';
import { completionRate } from '../utils/progress';

type Tab = 'ALL' | 'OPEN' | 'OVERDUE' | 'COMPLETED';

export function ClassWork() {
  const { assignments, subjects } = useStudyForge();
  const { open } = useQuickAdd();
  const [tab, setTab] = useState<Tab>('ALL');
  const [query, setQuery] = useState('');
  const [subjectId, setSubjectId] = useState('');

  const filtered = useMemo(
    () =>
    assignments.filter((a) => {
      if (subjectId && a.subjectId !== subjectId) return false;
      const q = query.trim().toLowerCase();
      if (q && !`${a.title} ${a.description}`.toLowerCase().includes(q)) return false;
      if (tab === 'OPEN') return a.status !== 'COMPLETED';
      if (tab === 'OVERDUE') return a.status !== 'COMPLETED' && isOverdue(a.dueDate);
      if (tab === 'COMPLETED') return a.status === 'COMPLETED';
      return true;
    }),
    [assignments, query, subjectId, tab]
  );

  return (
    <div>
      <PageHeader
        title="Class work"
        subtitle="Every assignment across every subject, with its checklist progress."
        actions={<Button onClick={() => open('assignment')}>+ Add assignment</Button>} />
      

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_260px_260px]">
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search assignments…"
          label="Search assignments" />
        
        <Select
          label="Subject"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          options={[
          { value: '', label: 'All subjects' },
          ...subjects.map((s) => ({ value: s.id, label: s.name }))]
          } />
        
        <Card tone="green" className="flex items-center justify-between px-4 py-3" shadow="sm">
          <span className="font-display text-xs font-bold uppercase tracking-[0.12em]">
            Completion
          </span>
          <span className="font-display text-2xl font-bold leading-none">
            {completionRate(assignments)}%
          </span>
        </Card>
      </div>

      <div className="mb-6">
        <FilterTabs
          label="Assignment filters"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'ALL', label: 'All', count: assignments.length },
          {
            value: 'OPEN',
            label: 'Open',
            count: assignments.filter((a) => a.status !== 'COMPLETED').length
          },
          {
            value: 'OVERDUE',
            label: 'Overdue',
            count: assignments.filter((a) => a.status !== 'COMPLETED' && isOverdue(a.dueDate)).length
          },
          {
            value: 'COMPLETED',
            label: 'Completed',
            count: assignments.filter((a) => a.status === 'COMPLETED').length
          }]
          } />
        
      </div>

      {filtered.length > 0 ?
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) =>
        <AssignmentCard key={a.id} assignment={a} />
        )}
        </ul> :

      <EmptyState
        icon={<ClipboardListIcon className="h-8 w-8" strokeWidth={3} aria-hidden />}
        title="No assignments here"
        subtitle="Add an assignment, or clear the filters to see everything."
        actions={<Button onClick={() => open('assignment')}>Add assignment</Button>} />

      }
    </div>);

}
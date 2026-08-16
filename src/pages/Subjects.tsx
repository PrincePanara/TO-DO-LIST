import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpenIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { FilterTabs, PageHeader, SearchField } from '../components/ui/PageHeader';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { subjectStats } from '../utils/progress';
import { isOverdue } from '../utils/date';

type Tab = 'ALL' | 'ACTIVE' | 'COMPLETED' | 'ATTENTION';

export function Subjects() {
  const { subjects, tasks, assignments, labs, projects } = useStudyForge();
  const { open } = useQuickAdd();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('ALL');
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () =>
    subjects.map((s) => {
      const stats = subjectStats(s.id, tasks, assignments, labs, projects);
      const needsAttention =
      tasks.some((t) => t.subjectId === s.id && t.status !== 'COMPLETED' && isOverdue(t.dueDate)) ||
      assignments.some(
        (a) => a.subjectId === s.id && a.status !== 'COMPLETED' && isOverdue(a.dueDate)
      ) ||
      labs.some(
        (l) => l.subjectId === s.id && l.status !== 'COMPLETED' && isOverdue(l.submissionDate)
      );
      return { subject: s, stats, needsAttention };
    }),
    [assignments, labs, projects, subjects, tasks]
  );

  const filtered = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    if (q && !`${r.subject.name} ${r.subject.code} ${r.subject.teacher}`.toLowerCase().includes(q))
    return false;
    if (tab === 'COMPLETED') return r.stats.progress >= 100;
    if (tab === 'ACTIVE') return r.stats.progress < 100;
    if (tab === 'ATTENTION') return r.needsAttention;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="My subjects"
        subtitle={`${subjects.length} subjects this semester. Open one to manage its class work, labs, projects and notes.`}
        actions={
        <>
            <Button variant="white" onClick={() => navigate('/import')}>
              Import PDF
            </Button>
            <Button onClick={() => open('subject')}>+ Add subject</Button>
          </>
        } />
      

      <div className="mb-6 space-y-4">
        <div className="max-w-xl">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search subjects…"
            label="Search subjects" />
          
        </div>
        <FilterTabs
          label="Subject filters"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'ALL', label: 'All', count: rows.length },
          { value: 'ACTIVE', label: 'Active', count: rows.filter((r) => r.stats.progress < 100).length },
          {
            value: 'COMPLETED',
            label: 'Completed',
            count: rows.filter((r) => r.stats.progress >= 100).length
          },
          {
            value: 'ATTENTION',
            label: 'Needs attention',
            count: rows.filter((r) => r.needsAttention).length
          }]
          } />
        
      </div>

      {filtered.length > 0 ?
      <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) =>
        <SubjectCard key={r.subject.id} subject={r.subject} stats={r.stats} />
        )}
        </ul> :

      <EmptyState
        icon={<BookOpenIcon className="h-8 w-8" strokeWidth={3} aria-hidden />}
        title="No subjects yet"
        subtitle="Import your syllabus or add your first subject."
        actions={
        <>
              <Button onClick={() => navigate('/import')}>Import PDF</Button>
              <Button variant="white" onClick={() => open('subject')}>
                Add subject
              </Button>
            </>
        } />

      }
    </div>);

}
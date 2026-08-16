import React, { useMemo, useState } from 'react';
import { PartyPopperIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/States';
import { FilterTabs, PageHeader, SearchField } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Field';
import { TaskCard } from '../components/tasks/TaskCard';
import { daysUntil, isOverdue, isToday } from '../utils/date';
import type { Priority, Task, TaskCategory, WorkStatus } from '../types';

type Tab = 'ALL' | 'TODAY' | 'UPCOMING' | 'OVERDUE' | 'COMPLETED';

export function Tasks() {
  const { tasks, subjects } = useStudyForge();
  const { open } = useQuickAdd();
  const [tab, setTab] = useState<Tab>('ALL');
  const [query, setQuery] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');

  const matchTab = (t: Task, which: Tab) => {
    const active = t.status !== 'COMPLETED';
    if (which === 'TODAY') return active && isToday(t.dueDate);
    if (which === 'UPCOMING') return active && daysUntil(t.dueDate) > 0;
    if (which === 'OVERDUE') return active && isOverdue(t.dueDate);
    if (which === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  };

  const filtered = useMemo(
    () =>
    tasks.filter((t) => {
      if (!matchTab(t, tab)) return false;
      if (subjectId && t.subjectId !== subjectId) return false;
      if (category && t.category !== category as TaskCategory) return false;
      if (priority && t.priority !== priority as Priority) return false;
      if (status && t.status !== status as WorkStatus) return false;
      const q = query.trim().toLowerCase();
      if (q && !`${t.title} ${t.description}`.toLowerCase().includes(q)) return false;
      return true;
    }),
    [category, priority, query, status, subjectId, tab, tasks]
  );

  const counts: Record<Tab, number> = {
    ALL: tasks.length,
    TODAY: tasks.filter((t) => matchTab(t, 'TODAY')).length,
    UPCOMING: tasks.filter((t) => matchTab(t, 'UPCOMING')).length,
    OVERDUE: tasks.filter((t) => matchTab(t, 'OVERDUE')).length,
    COMPLETED: tasks.filter((t) => matchTab(t, 'COMPLETED')).length
  };

  return (
    <div>
      <PageHeader
        title="All tasks"
        subtitle="Every piece of academic work in one list — filter it down to exactly what you need next."
        actions={<Button onClick={() => open('task')}>+ Add task</Button>} />
      

      <div className="mb-6 space-y-4">
        <div className="max-w-xl">
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder="Search tasks…"
            label="Search tasks" />
          
        </div>
        <FilterTabs
          label="Task time filters"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'ALL', label: 'All', count: counts.ALL },
          { value: 'TODAY', label: 'Today', count: counts.TODAY },
          { value: 'UPCOMING', label: 'Upcoming', count: counts.UPCOMING },
          { value: 'OVERDUE', label: 'Overdue', count: counts.OVERDUE },
          { value: 'COMPLETED', label: 'Completed', count: counts.COMPLETED }]
          } />
        
        <Card className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-4" shadow="sm">
          <Select
            label="Subject"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            options={[
            { value: '', label: 'All subjects' },
            ...subjects.map((s) => ({ value: s.id, label: s.name }))]
            } />
          
          <Select
            label="Type"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
            { value: '', label: 'All types' },
            { value: 'STUDY', label: 'Study' },
            { value: 'ASSIGNMENT', label: 'Assignment' },
            { value: 'LAB', label: 'Lab' },
            { value: 'MINI_PROJECT', label: 'Mini project' },
            { value: 'MAJOR_PROJECT', label: 'Major project' },
            { value: 'PERSONAL', label: 'Personal' }]
            } />
          
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
            { value: '', label: 'All priorities' },
            { value: 'URGENT', label: 'Urgent' },
            { value: 'IMPORTANT', label: 'Important' },
            { value: 'NORMAL', label: 'Normal' }]
            } />
          
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
            { value: '', label: 'Any status' },
            { value: 'NOT_STARTED', label: 'Not started' },
            { value: 'IN_PROGRESS', label: 'In progress' },
            { value: 'COMPLETED', label: 'Completed' }]
            } />
          
        </Card>
      </div>

      {filtered.length > 0 ?
      <ul className="space-y-4">
          {filtered.map((t) =>
        <TaskCard key={t.id} task={t} />
        )}
        </ul> :

      <EmptyState
        icon={<PartyPopperIcon className="h-8 w-8" strokeWidth={3} aria-hidden />}
        title="Your task list is clear 🎉"
        subtitle="No tasks match these filters. Clear them, or add the next thing you need to do."
        actions={<Button onClick={() => open('task')}>Add task</Button>} />

      }
    </div>);

}
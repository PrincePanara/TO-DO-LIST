import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, TrashIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Card, SectionHeading } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/Progress';
import { EmptyState } from '../components/ui/States';
import { FilterTabs, PageHeader } from '../components/ui/PageHeader';
import { dueLabel, isOverdue, shortDate } from '../utils/date';
import { itemProgress } from '../utils/progress';

type Tab = 'OVERVIEW' | 'CODE' | 'OUTPUT' | 'VIVA' | 'NOTES';

export function LabDetail() {
  const { labId = '' } = useParams();
  const { labs, subject, upsertLab, removeLab, toast } = useStudyForge();
  const { open } = useQuickAdd();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('OVERVIEW');

  const lab = labs.find((l) => l.id === labId);
  if (!lab) {
    return (
      <EmptyState
        title="Lab record not found"
        subtitle="It may have been deleted."
        actions={
        <Link to="/app/lab-work">
            <Button>Back to lab work</Button>
          </Link>
        } />);


  }

  const s = subject(lab.subjectId);
  const progress = itemProgress(lab);
  const overdue = lab.status !== 'COMPLETED' && isOverdue(lab.submissionDate);

  const toggleItem = (id: string) => {
    const checklist = lab.checklist.map((c) => c.id === id ? { ...c, done: !c.done } : c);
    upsertLab({
      ...lab,
      checklist,
      status: checklist.every((c) => c.done) ? 'COMPLETED' : 'IN_PROGRESS'
    });
  };

  return (
    <div>
      <PageHeader
        backTo={s ? `/app/subjects/${s.id}` : '/app/lab-work'}
        backLabel={s ? s.name : 'Lab work'}
        eyebrow={
        <>
            <Badge tone="purple">Lab {String(lab.number).padStart(2, '0')}</Badge>
            {s && <Badge tone="ink">{s.code}</Badge>}
            <StatusBadge status={lab.status} />
            {overdue && <Badge tone="red">Overdue</Badge>}
          </>
        }
        title={lab.title}
        subtitle={`Submission ${shortDate(lab.submissionDate)} — ${dueLabel(lab.submissionDate).toLowerCase()}`}
        actions={
        <>
            <Button variant="white" onClick={() => open('lab', { editLab: lab })}>
              Edit
            </Button>
            <Button
            variant="danger"
            onClick={() => {
              removeLab(lab.id);
              toast('Lab record deleted', 'error');
              navigate('/app/lab-work');
            }}>
            
              <TrashIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Delete
            </Button>
          </>
        } />
      

      <Card tone={overdue ? 'red' : 'purple'} className="mb-6 flex flex-wrap items-center gap-6 p-6">
        <p className="font-display text-5xl font-bold leading-none">{progress}%</p>
        <ProgressBar value={progress} tone="yellow" height="lg" className="min-w-[200px] flex-1" />
        <Button
          variant={lab.status === 'COMPLETED' ? 'ok' : 'ink'}
          onClick={() => {
            const completed = lab.status === 'COMPLETED';
            upsertLab({
              ...lab,
              status: completed ? 'IN_PROGRESS' : 'COMPLETED',
              checklist: lab.checklist.map((c) => ({ ...c, done: !completed }))
            });
            toast(completed ? 'Reopened lab record' : 'Lab work completed ✓');
          }}>
          
          {lab.status === 'COMPLETED' ? 'Completed ✓' : 'Mark complete'}
        </Button>
      </Card>

      <div className="mb-6">
        <FilterTabs
          label="Lab sections"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'OVERVIEW', label: 'Overview' },
          { value: 'CODE', label: 'Code' },
          { value: 'OUTPUT', label: 'Output' },
          { value: 'VIVA', label: 'Viva', count: lab.viva.length },
          { value: 'NOTES', label: 'Notes' }]
          } />
        
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {tab === 'OVERVIEW' &&
          <>
              <Card className="p-6">
                <SectionHeading title="Objective" />
                <p className="text-sm leading-relaxed">{lab.objective || 'No objective recorded.'}</p>
              </Card>
              <Card className="p-6">
                <SectionHeading title="Theory" />
                <p className="text-sm leading-relaxed">{lab.theory || 'No theory recorded.'}</p>
              </Card>
              <Card className="p-6">
                <SectionHeading title="Requirements" />
                {lab.requirements.length > 0 ?
              <ul className="flex flex-wrap gap-2">
                    {lab.requirements.map((r) =>
                <li key={r}>
                        <Badge tone="yellow">{r}</Badge>
                      </li>
                )}
                  </ul> :

              <p className="muted text-sm">No requirements listed.</p>
              }
              </Card>
              <Card className="p-6">
                <SectionHeading title="Procedure" />
                <ol className="space-y-2">
                  {lab.procedure.map((p, i) =>
                <li
                  key={`${p}-${i}`}
                  className="flex gap-3 border-3 border-ink px-3 py-2 text-sm dark:border-white">
                  
                      <span className="font-display font-bold">{String(i + 1).padStart(2, '0')}</span>
                      <span>{p}</span>
                    </li>
                )}
                </ol>
              </Card>
            </>
          }

          {tab === 'CODE' &&
          <Card className="p-6">
              <SectionHeading title="Code" />
              <pre className="overflow-x-auto border-3 border-ink bg-ink p-4 font-mono text-xs leading-relaxed text-white dark:border-white">
                <code>{lab.code || '// no code recorded yet'}</code>
              </pre>
            </Card>
          }

          {tab === 'OUTPUT' &&
          <Card className="p-6">
              <SectionHeading title="Output" />
              <pre className="overflow-x-auto border-3 border-ink bg-ok p-4 font-mono text-xs leading-relaxed text-ink dark:border-white">
                <code>{lab.output || 'no output captured yet'}</code>
              </pre>
            </Card>
          }

          {tab === 'VIVA' &&
          <Card className="p-6">
              <SectionHeading title="Viva preparation" hint="Questions the examiner is most likely to ask." />
              {lab.viva.length > 0 ?
            <ol className="space-y-3">
                  {lab.viva.map((v, i) =>
              <li key={v.id} className="border-3 border-ink p-4 dark:border-white">
                      <p className="font-display text-sm font-bold uppercase tracking-[0.06em]">
                        Q{i + 1}. {v.question}
                      </p>
                      <p className="muted mt-2 text-sm">{v.answer}</p>
                    </li>
              )}
                </ol> :

            <p className="muted text-sm">No viva questions added yet.</p>
            }
            </Card>
          }

          {tab === 'NOTES' &&
          <Card className="p-6">
              <SectionHeading title="Notes" />
              <textarea
              value={lab.notes}
              onChange={(e) => upsertLab({ ...lab, notes: e.target.value })}
              rows={6}
              aria-label="Lab notes"
              placeholder="Observations, errors you hit, things to mention in the viva…"
              className="brut-input" />
            
            </Card>
          }
        </div>

        <aside className="space-y-6">
          <Card className="p-5">
            <SectionHeading title="Checklist" />
            <ul className="space-y-2">
              {lab.checklist.map((c) =>
              <li key={c.id}>
                  <button
                  type="button"
                  onClick={() => toggleItem(c.id)}
                  aria-pressed={c.done}
                  className="flex w-full items-center gap-3 border-3 border-ink px-3 py-2 text-left press focus-brut dark:border-white">
                  
                    <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center border-3 border-ink dark:border-white ${
                    c.done ? 'bg-ok' : 'bg-white dark:bg-transparent'}`
                    }>
                    
                      {c.done && <CheckIcon className="h-3.5 w-3.5 text-ink" strokeWidth={4} aria-hidden />}
                    </span>
                    <span className={`text-sm ${c.done ? 'line-through opacity-60' : ''}`}>{c.label}</span>
                  </button>
                </li>
              )}
            </ul>
          </Card>

          <Card className="p-5">
            <SectionHeading title="Submission" />
            <p className="muted text-sm">Due {shortDate(lab.submissionDate)}</p>
            <div className="mt-3 space-y-2">
              {lab.attachments.length > 0 ?
              lab.attachments.map((a) =>
              <p key={a} className="truncate border-3 border-ink px-3 py-2 text-sm dark:border-white">
                    {a}
                  </p>
              ) :

              <p className="muted text-sm">No attachments.</p>
              }
            </div>
          </Card>
        </aside>
      </div>
    </div>);

}
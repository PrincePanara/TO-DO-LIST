import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, TrashIcon } from 'lucide-react';
import type { Subject } from '../../types';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { Card, type CardTone } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/Progress';
import type { SubjectStats } from '../../utils/progress';

const toneMap: Record<Subject['color'], CardTone> = {
  purple: 'purple',
  yellow: 'yellow',
  red: 'red',
  green: 'green',
  white: 'white'
};

export function SubjectCard({ subject, stats }: {subject: Subject;stats: SubjectStats;}) {
  const { removeSubject } = useStudyForge();
  const tone = toneMap[subject.color];
  const inverted = tone === 'purple' || tone === 'red';

  return (
    <Card as="li" tone={tone} className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-bold uppercase leading-tight tracking-tight">
          {subject.name}
        </h3>
        <span
          className={`shrink-0 border-3 border-ink px-2 py-0.5 font-mono text-xs font-bold ${
          inverted ? 'bg-white text-ink' : 'bg-ink text-white'}`
          }>
          
          {subject.code}
        </span>
      </div>

      <p className={`mt-1 text-xs font-bold uppercase tracking-[0.12em] ${inverted ? 'opacity-80' : 'opacity-70'}`}>
        {subject.credits} credits • {subject.units} units{subject.teacher ? ` • ${subject.teacher}` : ''}
      </p>

      <ProgressBar
        value={stats.progress}
        tone={inverted ? 'yellow' : 'purple'}
        className="mt-4"
        label="Progress"
        showValue />
      

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        {[
        ['Tasks', stats.tasks],
        ['Assign.', stats.assignments],
        ['Labs', stats.labs],
        ['Projects', stats.projects]].
        map(([label, value]) =>
        <div
          key={String(label)}
          className={`border-3 border-ink px-2 py-1.5 ${inverted ? 'bg-white text-ink' : 'bg-white/70'}`}>
          
            <dt className="font-display text-[10px] font-bold uppercase tracking-[0.1em]">{label}</dt>
            <dd className="font-display text-lg font-bold leading-none">{value}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {subject.theory && <Badge tone={inverted ? 'plain' : 'ink'}>Theory</Badge>}
        {subject.lab && <Badge tone={inverted ? 'plain' : 'ink'}>Lab</Badge>}
      </div>

      <div className="mt-5 flex gap-2">
        <Link
          to={`/app/subjects/${subject.id}`}
          className={`inline-flex flex-1 items-center justify-center gap-2 border-3 border-ink px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.08em] shadow-brut-sm press focus-brut ${
          inverted ? 'bg-white text-ink' : 'bg-ink text-white'}`
          }>
          
          Open subject <ArrowRightIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
        </Link>
        <button
          type="button"
          aria-label="Delete subject"
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${subject.name}?`)) {
              removeSubject(subject.id);
            }
          }}
          className={`flex shrink-0 items-center justify-center border-3 border-ink px-4 shadow-brut-sm press focus-brut ${inverted ? 'bg-white text-ink hover:bg-danger hover:text-white' : 'bg-white text-ink hover:bg-danger hover:text-white'}`}
        >
          <TrashIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
        </button>
      </div>
    </Card>);

}
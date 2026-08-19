import React from 'react';
import { Link } from 'react-router-dom';
import { FlaskConicalIcon } from 'lucide-react';
import type { LabWork } from '../../types';
import { Card, type CardTone } from '../ui/Card';
import { Badge, StatusBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/Progress';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { dueLabel, isOverdue } from '../../utils/date';
import { itemProgress } from '../../utils/progress';

export function LabCard({ lab, showSubject = true }: {lab: LabWork;showSubject?: boolean;}) {
  const { subject } = useStudyForge();
  const s = subject(lab.subjectId);
  const progress = itemProgress(lab);
  const overdue = lab.status !== 'COMPLETED' && isOverdue(lab.submissionDate);

  const tone: CardTone = lab.color || 'white';
  const inverted = tone === 'purple' || tone === 'red';

  return (
    <Card as="li" tone={tone} className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex items-center gap-2 border-3 border-ink px-2 py-0.5 font-display text-xs font-bold uppercase tracking-[0.12em] ${inverted ? 'bg-white text-ink' : 'bg-ink text-white'} dark:border-white`}>
          <FlaskConicalIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
          Lab {String(lab.number).padStart(2, '0')}
        </span>
        {overdue && <Badge tone={inverted ? 'plain' : 'red'}>Overdue</Badge>}
      </div>

      <h3 className="mt-3 font-display text-xl font-bold uppercase leading-tight tracking-tight">
        {lab.title}
      </h3>
      {showSubject && s &&
      <p className={`mt-1 text-xs font-bold uppercase tracking-[0.12em] ${inverted ? 'opacity-80' : 'opacity-70'}`}>{s.name}</p>
      }
      <p className={`mt-3 line-clamp-2 text-sm ${inverted ? 'opacity-90' : 'opacity-80'}`}>{lab.objective}</p>

      <ProgressBar
        value={progress}
        tone={inverted ? 'yellow' : (lab.status === 'COMPLETED' ? 'green' : overdue ? 'red' : 'purple')}
        className="mt-4"
        label={`${progress}% complete`} />
      

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <StatusBadge status={lab.status} />
        <Badge tone={inverted ? 'plain' : (overdue ? 'red' : 'plain')}>Submit {dueLabel(lab.submissionDate)}</Badge>
        <Badge tone={inverted ? 'plain' : 'yellow'}>{lab.viva.length} viva Qs</Badge>
      </div>

      <Link
        to={`/app/labs/${lab.id}`}
        className={`mt-5 inline-flex items-center justify-center border-3 border-ink px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.08em] shadow-brut-sm press focus-brut dark:border-white ${inverted ? 'bg-white text-ink' : 'bg-ink text-white'}`}>
        
        Open lab record
      </Link>
    </Card>);

}
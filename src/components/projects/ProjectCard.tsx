import React from 'react';
import { Link } from 'react-router-dom';
import { GitBranchIcon, UsersIcon } from 'lucide-react';
import type { Project } from '../../types';
import { Card } from '../ui/Card';
import { Badge, PriorityBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/Progress';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { dueLabel, isOverdue } from '../../utils/date';
import { projectProgress } from '../../utils/progress';

const stageLabel: Record<Project['stage'], string> = {
  IDEA: 'Idea',
  PLANNING: 'Planning',
  DEVELOPMENT: 'In development',
  TESTING: 'Testing',
  DOCUMENTATION: 'Documentation',
  PRESENTATION: 'Presentation',
  COMPLETED: 'Completed'
};

export function ProjectCard({ project }: {project: Project;}) {
  const { subject } = useStudyForge();
  const s = subject(project.subjectId);
  const progress = projectProgress(project);
  const major = project.type === 'MAJOR';
  const overdue = project.status !== 'COMPLETED' && isOverdue(project.deadline);
  const doneMilestones = project.milestones.filter((m) => m.status === 'COMPLETED').length;

  return (
    <Card
      as="li"
      tone={major ? 'purple' : 'white'}
      shadow={major ? 'lg' : 'md'}
      className={`flex h-full flex-col ${major ? 'p-6 lg:p-8' : 'p-5'}`}>
      
      <div className="flex items-start justify-between gap-3">
        <Badge tone={major ? 'yellow' : 'purple'}>{major ? 'Major project' : 'Mini project'}</Badge>
        {overdue ? <Badge tone="red">Overdue</Badge> : <PriorityBadge priority={project.priority} />}
      </div>

      <h3
        className={`mt-3 font-display font-bold uppercase leading-none tracking-tight ${
        major ? 'text-3xl lg:text-4xl' : 'text-xl'}`
        }>
        
        {project.name}
      </h3>
      <p className={`mt-2 text-xs font-bold uppercase tracking-[0.12em] ${major ? 'opacity-80' : 'muted'}`}>
        {s?.name ?? 'General'} • {stageLabel[project.stage]}
      </p>

      <p className={`mt-3 text-sm ${major ? 'opacity-90' : 'muted'} ${major ? '' : 'line-clamp-2'}`}>
        {project.description}
      </p>

      <ProgressBar
        value={progress}
        tone={major ? 'yellow' : 'purple'}
        height={major ? 'lg' : 'md'}
        className="mt-5"
        label="Progress"
        showValue />
      

      {major &&
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {project.milestones.map((m) =>
        <li
          key={m.id}
          className="flex items-center justify-between gap-2 border-3 border-ink bg-white px-3 py-2 text-ink">
          
              <span className="truncate font-display text-xs font-bold uppercase">{m.title}</span>
              <span className="shrink-0 font-display text-xs font-bold">
                {m.status === 'COMPLETED' ? '✓' : `${m.progress}%`}
              </span>
            </li>
        )}
        </ul>
      }

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Badge tone={overdue ? 'red' : major ? 'plain' : 'ink'}>Due {dueLabel(project.deadline)}</Badge>
        <Badge tone={major ? 'plain' : 'plain'}>
          <UsersIcon className="h-3 w-3" strokeWidth={3} aria-hidden /> {(project.members ?? []).length}
        </Badge>
        <Badge tone={major ? 'plain' : 'plain'}>
          {doneMilestones}/{project.milestones.length} milestones
        </Badge>
      </div>

      {project.technologies.length > 0 &&
      <p
        className={`mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] ${
        major ? 'opacity-80' : 'muted'}`
        }>
        
          <GitBranchIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
          {project.technologies.join(' • ')}
        </p>
      }

      <Link
        to={`/app/projects/${project.id}`}
        className={`mt-5 inline-flex items-center justify-center border-3 border-ink px-4 py-2.5 font-display text-sm font-bold uppercase tracking-[0.08em] shadow-brut-sm press focus-brut dark:border-white ${
        major ? 'bg-sun text-ink' : 'bg-ink text-white'}`
        }>
        
        Open project
      </Link>
    </Card>);

}
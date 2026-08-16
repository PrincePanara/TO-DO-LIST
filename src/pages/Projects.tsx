import React, { useState } from 'react';
import { RocketIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useQuickAdd } from '../contexts/QuickAdd';
import { Button } from '../components/ui/Button';
import { SectionHeading } from '../components/ui/Card';
import { EmptyState } from '../components/ui/States';
import { FilterTabs, PageHeader } from '../components/ui/PageHeader';
import { ProjectCard } from '../components/projects/ProjectCard';

type Tab = 'ALL' | 'MINI' | 'MAJOR';

export function Projects() {
  const { projects } = useStudyForge();
  const { open } = useQuickAdd();
  const [tab, setTab] = useState<Tab>('ALL');

  const major = projects.filter((p) => p.type === 'MAJOR');
  const mini = projects.filter((p) => p.type === 'MINI');
  const showMajor = tab !== 'MINI' && major.length > 0;
  const showMini = tab !== 'MAJOR' && mini.length > 0;

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="Major projects carry milestones and a team. Mini projects stay light."
        actions={
        <>
            <Button variant="white" onClick={() => open('mini-project')}>
              + Mini project
            </Button>
            <Button onClick={() => open('major-project')}>+ Major project</Button>
          </>
        } />
      

      <div className="mb-6">
        <FilterTabs
          label="Project filters"
          value={tab}
          onChange={setTab}
          options={[
          { value: 'ALL', label: 'All', count: projects.length },
          { value: 'MINI', label: 'Mini projects', count: mini.length },
          { value: 'MAJOR', label: 'Major projects', count: major.length }]
          } />
        
      </div>

      {projects.length === 0 ?
      <EmptyState
        icon={<RocketIcon className="h-8 w-8" strokeWidth={3} aria-hidden />}
        title="No projects yet"
        subtitle="Start a mini project for a subject, or set up your major project with milestones."
        actions={<Button onClick={() => open('major-project')}>Create project</Button>} /> :


      <div className="space-y-10">
          {showMajor &&
        <section aria-label="Major projects">
              <SectionHeading
            title="Major projects"
            hint="Your headline work this semester — milestones drive the progress." />
          
              <ul className="grid gap-6">
                {major.map((p) =>
            <ProjectCard key={p.id} project={p} />
            )}
              </ul>
            </section>
        }

          {showMini &&
        <section aria-label="Mini projects">
              <SectionHeading title="Mini projects" />
              <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {mini.map((p) =>
            <ProjectCard key={p.id} project={p} />
            )}
              </ul>
            </section>
        }
        </div>
      }
    </div>);

}
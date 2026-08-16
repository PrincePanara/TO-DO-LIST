import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { Card, type CardTone } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const features: { n: string; icon: string; title: string; copy: string; tone: CardTone; }[] = [
  { n: '01', icon: '📚', title: 'Manage Subjects', copy: 'Organize your entire semester in one workspace.', tone: 'purple' },
  { n: '02', icon: '✓', title: 'Track Tasks', copy: 'Never forget academic work again.', tone: 'white' },
  { n: '03', icon: '🧪', title: 'Manage Labs', copy: 'Track experiments, records and submissions.', tone: 'yellow' },
  { n: '04', icon: '🚀', title: 'Build Projects', copy: 'Manage mini and major projects with milestones.', tone: 'white' },
  { n: '05', icon: '📅', title: 'Plan Your Week', copy: 'Create your timetable and daily schedule.', tone: 'white' },
  { n: '06', icon: '📊', title: 'Track Progress', copy: 'Understand your academic performance.', tone: 'green' }];


export function Welcome() {
  const navigate = useNavigate();

  return (
    <OnboardingShell>
      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl">
          Welcome to
          <br />
          <span className="bg-brand px-2 text-white">Qubeso To Do List</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink/70">
          Your academic life. Organized. Import your syllabus once and every subject, deadline, lab
          and project lands in one place.
        </p>
      </div>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {features.map((f, i) =>
          <motion.li
            key={f.n}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}>

            <Card tone={f.tone} className="flex h-full flex-col p-6">
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center border-3 border-ink bg-white text-2xl"
                  aria-hidden>

                  {f.icon}
                </span>
                <span className="font-display text-2xl font-bold opacity-40">{f.n}</span>
              </div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">{f.title}</h2>
              <p className={f.tone === 'white' ? 'muted mt-2 text-sm' : 'mt-2 text-sm opacity-90'}>
                {f.copy}
              </p>
            </Card>
          </motion.li>
        )}
      </ul>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <Button size="lg" onClick={() => navigate('/setup')}>
          Get started <ArrowRightIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
        </Button>
        <Link
          to="/app/dashboard"
          className="font-display text-sm font-bold uppercase tracking-[0.14em] underline decoration-[3px] underline-offset-4 focus-brut">

          Explore the demo workspace
        </Link>
      </div>
    </OnboardingShell>);

}
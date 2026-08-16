import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { SkeletonBlock } from '../../components/ui/States';
import { detectedFromPdf } from '../../data/seed';

const steps = [
'PDF uploaded',
'Reading document',
'Detecting subjects',
'Detecting units',
'Building academic structure',
'Preparing workspace'];


export function PdfAnalysis() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress((p) => p >= 100 ? 100 : p + Math.max(2, Math.round((100 - p) / 12)));
    }, 180);
    return () => window.clearInterval(id);
  }, []);

  const done = progress >= 100;
  const activeStep = Math.min(steps.length - 1, Math.floor(progress / 100 * steps.length));

  return (
    <OnboardingShell step={done ? 'Analysis complete' : 'Analyzing'}>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <Card className="relative overflow-hidden p-5" shadow="lg">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em]">
              semester-5-syllabus.pdf
            </p>
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em]">Page 1 / 14</p>
          </div>
          <div className="relative border-3 border-ink bg-white p-6 dark:bg-white/5">
            {!done &&
            <div
              className="scanline pointer-events-none absolute left-0 right-0 h-1 bg-brand"
              aria-hidden />

            }
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-brand">
              Scheme of examination
            </p>
            <h2 className="mt-2 font-display text-xl font-bold uppercase leading-tight">
              B.Tech Computer Science — Semester 5
            </h2>
            <div className="mt-5 space-y-3">
              {detectedFromPdf.slice(0, 8).map((d, i) =>
              <div key={d.code} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 font-mono text-xs font-bold">{d.code}</span>
                  {i <= activeStep + 2 ?
                <span className="flex-1 truncate border-b-[2px] border-dashed border-ink/40 text-sm">
                      {d.name}
                    </span> :

                <SkeletonBlock className="h-4 flex-1 border-0" />
                }
                  <span className="w-14 shrink-0 text-right font-mono text-xs">
                    {d.credits} cr
                  </span>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="space-y-5">
          <Card tone="purple" className="p-6">
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] opacity-80">
              {done ? 'Structure ready' : 'Analyzing syllabus'}
            </p>
            <p className="mt-1 font-display text-6xl font-bold leading-none">{progress}%</p>
            <div className="mt-5 border-3 border-ink bg-white">
              <div
                className="h-5 bg-sun transition-[width] duration-200 ease-brut"
                style={{ width: `${progress}%` }} />
              
            </div>
          </Card>

          <Card className="p-6">
            <ol className="space-y-3" aria-live="polite">
              {steps.map((s, i) => {
                const complete = done || i < activeStep;
                const active = !done && i === activeStep;
                return (
                  <li key={s} className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center border-3 border-ink dark:border-white ${
                      complete ? 'bg-ok' : active ? 'bg-sun' : 'bg-transparent'}`
                      }>
                      
                      {complete ?
                      <CheckIcon className="h-4 w-4 text-ink" strokeWidth={4} aria-hidden /> :
                      active ?
                      <span className="h-2.5 w-2.5 animate-pulse bg-ink" aria-hidden /> :
                      null}
                    </span>
                    <span
                      className={`font-display text-sm font-bold uppercase tracking-[0.06em] ${
                      complete || active ? '' : 'opacity-40'}`
                      }>
                      
                      {s}
                    </span>
                  </li>);

              })}
            </ol>
          </Card>

          {done &&
          <Card tone="green" className="p-6">
              <p className="font-display text-4xl font-bold leading-none">
                {detectedFromPdf.length} subjects found
              </p>
              <p className="mt-2 text-sm text-ink/80">
                Review them before anything is added to your workspace.
              </p>
              <Button className="mt-5" variant="ink" onClick={() => navigate('/import/review')}>
                Review results <ArrowRightIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
              </Button>
            </Card>
          }
        </div>
      </div>
    </OnboardingShell>);

}
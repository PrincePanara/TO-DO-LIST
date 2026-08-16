import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useLocation } from 'react-router-dom';
import { parsePdfTimetable } from '../../utils/pdfParser';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import type { ClassSlot } from '../../types';

const steps = [
  'File uploaded',
  'Analyzing image/PDF',
  'Extracting grid structure',
  'Mapping time slots',
  'Linking to subjects',
  'Preparing preview'
];

export function AnalyzeTimetable() {
  const navigate = useNavigate();
  const location = useLocation();
  const { subjects } = useStudyForge();
  const [progress, setProgress] = useState(6);
  const [extractedClasses, setExtractedClasses] = useState<ClassSlot[]>([]);
  
  const file = location.state?.file as File | undefined;
  
  useEffect(() => {
    if (!file) return;

    let id: number;
    const runParse = async () => {
      try {
        const classes = await parsePdfTimetable(file, subjects.length > 0 ? subjects[0].id : '');
        setExtractedClasses(classes);
        setProgress(100);
      } catch (err) {
        console.error("Failed to parse PDF:", err);
        // Fallback to 100% just to let user review an empty grid or add manually
        setProgress(100);
      }
    };
    
    if (file.name.endsWith('.pdf')) {
      runParse();
    } else {
      // Simulate for images since pdfjs only handles PDFs
      id = window.setInterval(() => {
        setProgress((p) => p >= 100 ? 100 : p + Math.max(2, Math.round((100 - p) / 10)));
      }, 180);
    }

    return () => window.clearInterval(id);
  }, [file, subjects]);

  const done = progress >= 100;
  const activeStep = Math.min(steps.length - 1, Math.floor(progress / 100 * steps.length));

  return (
    <div className="mx-auto max-w-4xl py-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <Card className="relative overflow-hidden p-5" shadow="lg">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em] truncate max-w-[200px]">
              {file?.name || 'timetable.pdf'}
            </p>
            <p className="font-display text-xs font-bold uppercase tracking-[0.16em]">Page 1 / 1</p>
          </div>
          <div className="relative flex h-[400px] flex-col items-center justify-center border-3 border-ink bg-white p-6 text-center dark:bg-white/5">
            {!done && (
              <div
                className="scanline pointer-events-none absolute left-0 right-0 h-1 bg-brand"
                aria-hidden />
            )}
            <span className="text-6xl" aria-hidden>
              📅
            </span>
            <h2 className="mt-6 font-display text-xl font-bold uppercase leading-tight">
              Extracting Schedule...
            </h2>
            <p className="muted mt-2 text-sm">
              Please wait while we parse the grid and identify your classes.
            </p>
          </div>
        </Card>

        <div className="space-y-5">
          <Card tone="purple" className="p-6">
            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] opacity-80">
              {done ? 'Timetable ready' : 'Analyzing file'}
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
                      {complete ? (
                        <CheckIcon className="h-4 w-4 text-ink" strokeWidth={4} aria-hidden />
                      ) : active ? (
                        <span className="h-2.5 w-2.5 animate-pulse bg-ink" aria-hidden />
                      ) : null}
                    </span>
                    <span
                      className={`font-display text-sm font-bold uppercase tracking-[0.06em] ${
                      complete || active ? '' : 'opacity-40'}`
                      }>
                      {s}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Card>

          {done && (
            <Card tone="green" className="p-6">
              <p className="font-display text-4xl font-bold leading-none">
                Classes Found
              </p>
              <p className="mt-2 text-sm text-ink/80">
                Review and map them to your subjects before adding to the timetable.
              </p>
              <Button className="mt-5" variant="ink" onClick={() => navigate('/app/timetable/review', { state: { classes: extractedClasses } })}>
                Review schedule <ArrowRightIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

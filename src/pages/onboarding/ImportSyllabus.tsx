import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, FileTextIcon, UploadIcon } from 'lucide-react';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ErrorState } from '../../components/ui/States';

const detectable = [
'Subjects',
'Subject codes',
'Credits',
'Units',
'Topics',
'Theory papers',
'Lab subjects'];


export function ImportSyllabus() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(false);

  const accept = (file: File | undefined) => {
    if (!file) return;
    if (file.type !== 'application/pdf' || file.size > 20 * 1024 * 1024) {
      setError(true);
      setFileName(null);
      return;
    }
    setError(false);
    setFileName(file.name);
  };

  if (error) {
    return (
      <OnboardingShell step="Step 2 of 2">
        <div className="mx-auto max-w-xl">
          <ErrorState
            title="PDF could not be read"
            subtitle="Something went wrong while analyzing your syllabus. Make sure it is a PDF under 20 MB and try again."
            actions={
            <>
                <Button onClick={() => setError(false)}>Try again</Button>
                <Button variant="white" onClick={() => inputRef.current?.click()}>
                  Upload another PDF
                </Button>
              </>
            } />
          
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="sr-only"
            onChange={(e) => accept(e.target.files?.[0])} />
          
        </div>
      </OnboardingShell>);

  }

  return (
    <OnboardingShell step="Step 2 of 2">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight sm:text-5xl">
            Import your syllabus
          </h1>
          <p className="muted mt-4 max-w-xl text-base">
            Upload your syllabus and let StudyForge organize your academic structure.
          </p>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              accept(e.dataTransfer.files?.[0]);
            }}
            className={`mt-8 flex flex-col items-center gap-4 border-3 border-dashed px-6 py-14 text-center transition-colors duration-150 ease-brut ${
            dragging ? 'border-brand bg-brand-soft' : 'border-ink bg-white'}`
            }>
            
            <span className="flex h-16 w-16 items-center justify-center border-3 border-ink bg-sun text-3xl shadow-brut-xs" aria-hidden>
              📄
            </span>
            <p className="font-display text-2xl font-bold uppercase tracking-tight">Drop PDF here</p>
            <p className="muted font-display text-xs font-bold uppercase tracking-[0.2em]">or</p>
            <Button onClick={() => inputRef.current?.click()}>
              <UploadIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Browse file
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="sr-only"
              aria-label="Choose a syllabus PDF"
              onChange={(e) => accept(e.target.files?.[0])} />
            
            <p className="muted font-display text-[11px] font-bold uppercase tracking-[0.18em]">
              PDF • Max 20 MB
            </p>
          </div>

          {fileName &&
          <Card className="mt-5 flex items-center gap-4 p-4" shadow="sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border-3 border-ink bg-ok">
                <FileTextIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-bold uppercase">
                  {fileName}
                </span>
                <span className="muted block text-xs">Ready to analyze</span>
              </span>
              <Badge tone="green">Uploaded ✓</Badge>
            </Card>
          }

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/import/analyze')}
              disabled={!fileName}>
              
              Analyze PDF <ArrowRightIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
            </Button>
            <button
              type="button"
              onClick={() => setFileName('semester-5-syllabus.pdf')}
              className="font-display text-sm font-bold uppercase tracking-[0.14em] underline decoration-[3px] underline-offset-4 focus-brut">
              
              Use sample syllabus
            </button>
          </div>
          {!fileName &&
          <p className="muted mt-3 text-xs">
              Choose a file first — the analyze button unlocks once a PDF is attached.
            </p>
          }
        </div>

        <Card tone="purple" className="h-fit p-6">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight">
            StudyForge can detect
          </h2>
          <ul className="mt-4 space-y-2.5">
            {detectable.map((d) =>
            <li key={d} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center border-[2px] border-ink bg-sun font-display text-xs font-bold text-ink">
                  ✓
                </span>
                {d}
              </li>
            )}
          </ul>
          <p className="mt-5 border-t-3 border-ink pt-4 text-xs opacity-90">
            Nothing is saved to your workspace until you review and confirm every detected subject.
          </p>
        </Card>
      </div>
    </OnboardingShell>);

}
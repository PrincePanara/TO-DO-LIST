import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, FileTextIcon, UploadIcon, ImageIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ErrorState } from '../../components/ui/States';

const detectable = [
  'Days of the week',
  'Time slots & duration',
  'Subjects & classes',
  'Theory vs Lab',
  'Room numbers'
];

export function ImportTimetable() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(false);

  const accept = (file: File | undefined) => {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    
    if ((!isImage && !isPdf) || file.size > 20 * 1024 * 1024) {
      setError(true);
      setFile(null);
      return;
    }
    setError(false);
    setFile(file);
  };

  if (error) {
    return (
      <div className="mx-auto max-w-xl py-12">
        <ErrorState
          title="File could not be read"
          subtitle="Something went wrong while analyzing your timetable. Make sure it is an Image or PDF under 20 MB and try again."
          actions={
            <>
              <Button onClick={() => setError(false)}>Try again</Button>
              <Button variant="white" onClick={() => inputRef.current?.click()}>
                Upload another file
              </Button>
            </>
          } />
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/*"
          className="sr-only"
          onChange={(e) => accept(e.target.files?.[0])} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight sm:text-5xl">
            Import your timetable
          </h1>
          <p className="muted mt-4 max-w-xl text-base">
            Upload an image or PDF of your class timetable and StudyForge will extract the schedule automatically.
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
            dragging ? 'border-brand bg-brand-soft' : 'border-ink bg-white dark:bg-[#232228] dark:border-white'}`
            }>
            
            <span className="flex h-16 w-16 items-center justify-center border-3 border-ink bg-sun text-3xl shadow-brut-xs" aria-hidden>
              📅
            </span>
            <p className="font-display text-2xl font-bold uppercase tracking-tight">Drop file here</p>
            <p className="muted font-display text-xs font-bold uppercase tracking-[0.2em]">or</p>
            <Button onClick={() => inputRef.current?.click()}>
              <UploadIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> Browse file
            </Button>
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,image/*"
              className="sr-only"
              aria-label="Choose a timetable file"
              onChange={(e) => accept(e.target.files?.[0])} />
            
            <p className="muted font-display text-[11px] font-bold uppercase tracking-[0.18em]">
              PDF or Image • Max 20 MB
            </p>
          </div>

          {file &&
          <Card className="mt-5 flex items-center gap-4 p-4" shadow="sm">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center border-3 border-ink bg-ok text-ink">
                {file.name.endsWith('.pdf') ? <FileTextIcon className="h-5 w-5" strokeWidth={3} aria-hidden /> : <ImageIcon className="h-5 w-5" strokeWidth={3} aria-hidden />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-sm font-bold uppercase">
                  {file.name}
                </span>
                <span className="muted block text-xs">Ready to analyze</span>
              </span>
              <Badge tone="green">Uploaded ✓</Badge>
            </Card>
          }

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/app/timetable/analyze', { state: { file } })}
              disabled={!file}>
              Analyze Timetable <ArrowRightIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
            </Button>
            <button
              type="button"
              onClick={() => {
                // Mock sample file
                const mockFile = new File(['mock content'], 'sample-schedule.pdf', { type: 'application/pdf' });
                setFile(mockFile);
              }}
              className="font-display text-sm font-bold uppercase tracking-[0.14em] underline decoration-[3px] underline-offset-4 focus-brut">
              Use sample image
            </button>
          </div>
          {!file &&
          <p className="muted mt-3 text-xs">
              Choose a file first — the analyze button unlocks once a file is attached.
            </p>
          }
        </div>

        <Card tone="purple" className="h-fit p-6">
          <h2 className="font-display text-lg font-bold uppercase tracking-tight">
            What we detect
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
            Nothing is saved to your timetable until you review and confirm the detected classes.
          </p>
        </Card>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { OnboardingShell } from '../../components/layout/OnboardingShell';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select, TextInput } from '../../components/ui/Field';
import { ProgressBar } from '../../components/ui/Progress';
import { useStudyForge } from '../../contexts/StudyForgeContext';

export function AcademicSetup() {
  const { profile, setProfile, setOnboarded } = useStudyForge();
  const navigate = useNavigate();
  const [form, setForm] = useState(profile);
  const [error, setError] = useState('');

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
  setForm({ ...form, [key]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('We need your name for the dashboard greeting');
      return;
    }
    setProfile(form);
    setOnboarded(true);
    // Onboarding complete → go to the dashboard
    navigate('/app/dashboard');
  };

  return (
    <OnboardingShell step="Step 1 of 2">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <Card className="p-6 sm:p-8">
          <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl">
            Academic setup
          </h1>
          <p className="muted mt-3 text-sm">
            This shapes your dashboard, timetable and progress reports. You can change all of it
            later in settings.
          </p>

          <ProgressBar value={50} className="mt-6" label="Setup progress" showValue />

          <form onSubmit={submit} className="mt-8 space-y-5">
            <TextInput
              label="Full name"
              placeholder="Rana Mehta"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setError('');
              }}
              error={error}
              required />
            
            <TextInput
              label="College / University"
              placeholder="Northgate Institute of Technology"
              value={form.college}
              onChange={update('college')} />
            
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Course"
                value={form.course}
                onChange={update('course')}
                options={[
                { value: 'B.Tech', label: 'B.Tech' },
                { value: 'B.E', label: 'B.E' },
                { value: 'BCA', label: 'BCA' },
                { value: 'B.Sc', label: 'B.Sc' },
                { value: 'M.Tech', label: 'M.Tech' }]
                } />
              
              <TextInput
                label="Branch"
                placeholder="Computer Science"
                value={form.branch}
                onChange={update('branch')} />
              
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Semester"
                value={form.semester}
                onChange={update('semester')}
                options={Array.from({ length: 8 }, (_, i) => ({
                  value: String(i + 1),
                  label: `Semester ${i + 1}`
                }))} />
              
              <Select
                label="Academic year"
                value={form.academicYear}
                onChange={update('academicYear')}
                options={[
                { value: '2026 – 2027', label: '2026 – 2027' },
                { value: '2027 – 2028', label: '2027 – 2028' }]
                } />
              
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button type="submit" size="lg">
                Continue <ArrowRightIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
              </Button>
              <button
                type="button"
                onClick={() => { setOnboarded(true); navigate('/app/dashboard'); }}
                className="font-display text-sm font-bold uppercase tracking-[0.14em] underline decoration-[3px] underline-offset-4 focus-brut">
                
                Skip for now
              </button>
            </div>
          </form>
        </Card>

        <div className="space-y-5">
          <Card tone="yellow" className="p-6">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">
              Why we ask
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-ink/80">
              <li>• Semester filters your subjects and timetable</li>
              <li>• Course and branch label your exports and records</li>
              <li>• Your name greets you on the dashboard</li>
            </ul>
          </Card>
          {/* TEMPORARILY COMMENTED OUT
          <Card tone="purple" className="p-6">
            <h2 className="font-display text-lg font-bold uppercase tracking-tight">Next up</h2>
            <p className="mt-2 text-sm opacity-90">
              Import your syllabus PDF. StudyForge detects the subjects and builds your workspace —
              nothing is created until you confirm.
            </p>
          </Card>
          */}
        </div>
      </div>
    </OnboardingShell>);

}
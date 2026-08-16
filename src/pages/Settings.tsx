import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangleIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, SectionHeading } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChipGroup, Select, TextInput, Toggle } from '../components/ui/Field';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';

export function Settings() {
  const { profile, setProfile, subjects, theme, toggleTheme, toast } = useStudyForge();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reminders, setReminders] = useState({
    assignment: true,
    lab: true,
    project: true,
    timetable: false
  });
  const [appearance, setAppearance] = useState<'LIGHT' | 'DARK' | 'SYSTEM'>(
    theme === 'dark' ? 'DARK' : 'LIGHT'
  );
  const [confirm, setConfirm] = useState<string | null>(null);

  const setAppearanceMode = (mode: 'LIGHT' | 'DARK' | 'SYSTEM') => {
    setAppearance(mode);
    const wantsDark =
    mode === 'DARK' ||
    mode === 'SYSTEM' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (wantsDark !== (theme === 'dark')) toggleTheme();
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" subtitle="Account, academic structure, reminders and data." />

      <div className="space-y-6">
        <Card className="p-6">
          <SectionHeading title="Account" />
          <div className="space-y-5">
            <TextInput
              label="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
            
            <TextInput label="Email" type="email" value={user?.email || ''} readOnly className="opacity-70 cursor-not-allowed" />
            <Button variant="white" onClick={() => toast('Password reset link sent ✓')}>
              Change password
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeading title="Academic" hint={`${subjects.length} subjects in this semester.`} />
          <div className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Select
                label="Semester"
                value={profile.semester}
                onChange={(e) => setProfile({ ...profile, semester: e.target.value })}
                options={Array.from({ length: 8 }, (_, i) => ({
                  value: String(i + 1),
                  label: `Semester ${i + 1}`
                }))} />
              
              <TextInput
                label="Academic year"
                value={profile.academicYear}
                onChange={(e) => setProfile({ ...profile, academicYear: e.target.value })} />
              
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="white" onClick={() => navigate('/app/subjects')}>
                Manage subjects
              </Button>
              <Button onClick={() => navigate('/import')}>Import syllabus PDF</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeading title="Notifications" />
          <div className="space-y-4">
            <Toggle
              label="Assignment reminders"
              description="24 hours before each due date"
              checked={reminders.assignment}
              onChange={(v) => setReminders({ ...reminders, assignment: v })} />
            
            <Toggle
              label="Lab reminders"
              description="Before each submission date"
              checked={reminders.lab}
              onChange={(v) => setReminders({ ...reminders, lab: v })} />
            
            <Toggle
              label="Project reminders"
              description="On milestone deadlines"
              checked={reminders.project}
              onChange={(v) => setReminders({ ...reminders, project: v })} />
            
            <Toggle
              label="Timetable reminders"
              description="15 minutes before every class"
              checked={reminders.timetable}
              onChange={(v) => setReminders({ ...reminders, timetable: v })} />
            
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeading title="Appearance" />
          <ChipGroup
            label="Theme"
            value={appearance}
            options={[
            { value: 'LIGHT', label: 'Light' },
            { value: 'DARK', label: 'Dark' },
            { value: 'SYSTEM', label: 'System' }]
            }
            onChange={setAppearanceMode} />
          
        </Card>

        <Card className="p-6">
          <SectionHeading title="Data" />
          <div className="flex flex-wrap gap-3">
            <Button variant="white" onClick={() => navigate('/import')}>
              Import
            </Button>
            <Button variant="white" onClick={() => toast('Export started ✓')}>
              Export
            </Button>
            <Button variant="white" onClick={() => toast('Backup created ✓')}>
              Backup now
            </Button>
          </div>
        </Card>

        <Card className="border-danger p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border-3 border-ink bg-danger text-white dark:border-white">
              <AlertTriangleIcon className="h-5 w-5" strokeWidth={3} aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-tight">Danger zone</h2>
              <p className="muted text-sm">These actions cannot be undone.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="danger" onClick={() => setConfirm('all tasks')}>
              Delete all tasks
            </Button>
            <Button variant="danger" onClick={() => setConfirm('academic data')}>
              Delete academic data
            </Button>
            <Button variant="danger" onClick={() => setConfirm('account')}>
              Delete account
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title="Are you sure?"
        subtitle={`This permanently deletes ${confirm}.`}
        width="sm"
        footer={
        <>
            <Button variant="white" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
            variant="danger"
            onClick={() => {
              toast(`Deleted ${confirm}`, 'error');
              setConfirm(null);
            }}>
            
              Yes, delete
            </Button>
          </>
        }>
        
        <p className="text-sm leading-relaxed">
          Deleting {confirm} removes it from every screen in StudyForge — dashboard, calendar,
          progress and notifications. There is no undo, and no backup is taken automatically.
        </p>
      </Modal>
    </div>);

}
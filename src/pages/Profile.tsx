import React, { useState } from 'react';
import { CheckCircleIcon, LogOutIcon, MailOpenIcon, XCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, SectionHeading } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Select, TextInput } from '../components/ui/Field';
import { PageHeader } from '../components/ui/PageHeader';
import { completionRate } from '../utils/progress';

export function Profile() {
  const { profile, setProfile, subjects, tasks, projects, notifications, respondToInvite, toast } = useStudyForge();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch {
      toast('Failed to log out', 'error');
    }
  };

  const initials = profile.name.
  split(' ').
  map((p) => p[0]).
  join('').
  slice(0, 2).
  toUpperCase();

  const stats = [
  { label: 'Subjects', value: subjects.length, tone: 'purple' as const },
  { label: 'Tasks completed', value: tasks.filter((t) => t.status === 'COMPLETED').length, tone: 'green' as const },
  { label: 'Projects', value: projects.length, tone: 'yellow' as const },
  { label: 'Study streak', value: '12d', tone: 'red' as const }];


  const details: [string, string][] = [
  ['College', profile.college],
  ['Course', profile.course],
  ['Branch', profile.branch],
  ['Semester', `Semester ${profile.semester}`],
  ['Academic year', profile.academicYear]];

  // Filter project invite notifications
  const projectInvites = notifications.filter((n) => n.kind === 'project_invite');

  const handleRespond = async (notifId: string, projectId: string, accept: boolean) => {
    setRespondingId(notifId);
    await respondToInvite(notifId, projectId, accept);
    setRespondingId(null);
  };

  return (
    <div>
      <PageHeader
        title="Profile"
        subtitle="Your academic identity across StudyForge."
        actions={
        <>
          <Button
            onClick={() => {
              setForm(profile);
              setEditing(true);
            }}>
            Edit profile
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            id="logout-btn"
          >
            <LogOutIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
            &nbsp;Logout
          </Button>
        </>
        } />
      

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card tone="purple" className="p-6 lg:p-8">
          <div className="flex items-center gap-5">
            <span className="flex h-24 w-24 shrink-0 items-center justify-center border-3 border-ink bg-sun font-display text-4xl font-bold text-ink shadow-brut">
              {initials}
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-2xl font-bold uppercase leading-tight tracking-tight">
                {profile.name}
              </h2>
              <p className="mt-1 text-sm opacity-90">{profile.college}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge tone="yellow">{profile.course}</Badge>
                <Badge tone="plain">Sem {profile.semester}</Badge>
              </div>
              {/* Show user's Firebase UID so they can share it */}
              {user?.uid && (
                <div className="mt-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Your UID</p>
                  <p
                    className="mt-0.5 cursor-pointer truncate font-mono text-xs font-bold underline decoration-dotted underline-offset-2 opacity-80 hover:opacity-100"
                    title="Click to copy"
                    onClick={() => {
                      navigator.clipboard.writeText(user.uid);
                      toast('UID copied to clipboard ✓');
                    }}
                    id="profile-uid"
                  >
                    {user.uid}
                  </p>
                </div>
              )}
            </div>
          </div>

          <dl className="mt-8 space-y-3">
            {details.map(([label, value]) =>
            <div key={label} className="flex items-center justify-between gap-4 border-b-3 border-ink pb-2">
                <dt className="font-display text-[11px] font-bold uppercase tracking-[0.14em] opacity-80">
                  {label}
                </dt>
                <dd className="truncate text-sm font-bold">{value || '—'}</dd>
              </div>
            )}
          </dl>
        </Card>

        <div className="space-y-6">
          <section aria-label="Statistics">
            <SectionHeading title="Semester stats" />
            <ul className="grid grid-cols-2 gap-4">
              {stats.map((s) =>
              <li key={s.label}>
                  <Card tone={s.tone} className="h-full p-5">
                    <p className="font-display text-4xl font-bold leading-none">{s.value}</p>
                    <p className="mt-2 font-display text-[11px] font-bold uppercase tracking-[0.12em] opacity-90">
                      {s.label}
                    </p>
                  </Card>
                </li>
              )}
            </ul>
          </section>

          <Card className="p-6">
            <SectionHeading title="Task completion" />
            <p className="font-display text-5xl font-bold leading-none">{completionRate(tasks)}%</p>
            <p className="muted mt-2 text-sm">
              {tasks.filter((t) => t.status === 'COMPLETED').length} of {tasks.length} tasks closed out
              this semester.
            </p>
          </Card>
        </div>
      </div>

      {/* ── Project Invitations Section ── */}
      <section aria-label="Project Invitations" className="mt-8">
        <SectionHeading
          title="Project Invitations"
          hint={
            projectInvites.length > 0
              ? `${projectInvites.length} pending invitation${projectInvites.length > 1 ? 's' : ''}`
              : undefined
          }
        />

        {projectInvites.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 p-8 text-center">
            <MailOpenIcon className="h-10 w-10 opacity-30" strokeWidth={1.5} />
            <p className="font-display text-sm font-bold uppercase tracking-wide opacity-50">
              No pending invitations
            </p>
            <p className="muted text-xs">
              When someone invites you to a project using your UID, it will appear here.
            </p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {projectInvites.map((notif) => {
              const isResponding = respondingId === notif.id;
              // Extract project name from the message: "You have been invited to join the project: <name>"
              const projectName = notif.message.replace('You have been invited to join the project: ', '');

              return (
                <li key={notif.id}>
                  <Card className="flex flex-wrap items-center gap-4 p-5" shadow="sm">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="purple">Project Invite</Badge>
                        {!notif.read && <Badge tone="red">New</Badge>}
                      </div>
                      <h3 className="mt-2 font-display text-lg font-bold uppercase leading-tight tracking-tight">
                        {projectName}
                      </h3>
                      <p className="muted mt-1 font-mono text-xs">
                        Project ID: {notif.meta}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        size="sm"
                        variant="ok"
                        disabled={isResponding}
                        onClick={() => handleRespond(notif.id, notif.meta, true)}
                        id={`accept-invite-${notif.id}`}
                      >
                        <CheckCircleIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
                        &nbsp;{isResponding ? 'Accepting…' : 'Accept'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={isResponding}
                        onClick={() => handleRespond(notif.id, notif.meta, false)}
                        id={`reject-invite-${notif.id}`}
                      >
                        <XCircleIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
                        &nbsp;{isResponding ? 'Declining…' : 'Decline'}
                      </Button>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit profile"
        width="md"
        footer={
        <>
            <Button variant="white" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              setProfile(form);
              setEditing(false);
              toast('Profile updated ✓');
            }}>
            
              Save profile
            </Button>
          </>
        }>
        
        <div className="space-y-5">
          <TextInput
            label="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          
          <TextInput
            label="College / University"
            value={form.college}
            onChange={(e) => setForm({ ...form, college: e.target.value })} />
          
          <div className="grid gap-5 sm:grid-cols-2">
            <TextInput
              label="Course"
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })} />
            
            <TextInput
              label="Branch"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })} />
            
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Semester"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              options={Array.from({ length: 8 }, (_, i) => ({
                value: String(i + 1),
                label: `Semester ${i + 1}`
              }))} />
            
            <TextInput
              label="Academic year"
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })} />
            
          </div>
        </div>
      </Modal>
    </div>);

}
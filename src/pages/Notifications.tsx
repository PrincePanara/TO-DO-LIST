import React from 'react';
import { BellIcon, CheckIcon, TrashIcon } from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { Card, SectionHeading } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/States';
import { PageHeader } from '../components/ui/PageHeader';
import { dueLabel, isToday } from '../utils/date';
import type { AppNotification } from '../types';

const kindStyles: Record<AppNotification['kind'], {dot: string;label: string;}> = {
  urgent: { dot: 'bg-danger', label: 'Urgent' },
  warn: { dot: 'bg-sun', label: 'Due soon' },
  info: { dot: 'bg-brand', label: 'Update' },
  success: { dot: 'bg-ok', label: 'Completed' },
  project_invite: { dot: 'bg-brand', label: 'Invite' }
};

function NotificationRow({ n }: {n: AppNotification;}) {
  const { markNotificationRead, removeNotification, toast } = useStudyForge();
  const style = kindStyles[n.kind];

  return (
    <Card
      as="li"
      shadow="sm"
      className={`flex items-start gap-4 p-4 ${n.read ? 'opacity-60' : ''}`}>
      
      <span
        className={`mt-1 h-4 w-4 shrink-0 rounded-full border-3 border-ink dark:border-white ${style.dot}`}
        aria-hidden />
      
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold leading-snug">{n.message}</p>
        <p className="muted mt-1 font-display text-[11px] font-bold uppercase tracking-[0.12em]">
          {style.label} • {n.meta} • {dueLabel(n.createdAt).toLowerCase()}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {!n.read &&
        <button
          type="button"
          onClick={() => markNotificationRead(n.id)}
          aria-label="Mark as read"
          title="Mark as read"
          className="flex h-8 w-8 items-center justify-center border-3 border-ink bg-ok press focus-brut dark:border-white">
          
            <CheckIcon className="h-3.5 w-3.5 text-ink" strokeWidth={4} aria-hidden />
          </button>
        }
        <button
          type="button"
          onClick={() => {
            removeNotification(n.id);
            toast('Notification deleted', 'error');
          }}
          aria-label="Delete notification"
          title="Delete notification"
          className="flex h-8 w-8 items-center justify-center border-3 border-ink bg-danger text-white press focus-brut dark:border-white">
          
          <TrashIcon className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
        </button>
      </div>
    </Card>);

}

export function NotificationsPage() {
  const { notifications, markAllNotificationsRead, toast } = useStudyForge();
  const today = notifications.filter((n) => isToday(n.createdAt));
  const earlier = notifications.filter((n) => !isToday(n.createdAt));
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread — deadlines, milestones and completions.` : 'You are all caught up.'}
        actions={
        notifications.length > 0 &&
        <Button
          variant="white"
          onClick={() => {
            markAllNotificationsRead();
            toast('All notifications marked as read ✓');
          }}>
          
              Mark all as read
            </Button>

        } />
      

      {notifications.length === 0 ?
      <EmptyState
        icon={<BellIcon className="h-8 w-8" strokeWidth={3} aria-hidden />}
        title="Nothing to report"
        subtitle="Reminders about assignments, labs, projects and classes will show up here." /> :


      <div className="max-w-3xl space-y-8">
          {today.length > 0 &&
        <section aria-label="Today's notifications">
              <SectionHeading title="Today" />
              <ul className="space-y-3">
                {today.map((n) =>
            <NotificationRow key={n.id} n={n} />
            )}
              </ul>
            </section>
        }
          {earlier.length > 0 &&
        <section aria-label="Earlier notifications">
              <SectionHeading title="Earlier" />
              <ul className="space-y-3">
                {earlier.map((n) =>
            <NotificationRow key={n.id} n={n} />
            )}
              </ul>
            </section>
        }
        </div>
      }
    </div>);

}
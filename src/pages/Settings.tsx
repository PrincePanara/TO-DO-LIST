import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { 
  UserIcon, 
  GraduationCapIcon, 
  BellIcon, 
  PaletteIcon, 
  DatabaseIcon, 
  ChevronRightIcon 
} from 'lucide-react';
import { useStudyForge } from '../contexts/StudyForgeContext';
import { useAuth } from '../contexts/AuthContext';

export function Settings() {
  const { profile } = useStudyForge();
  const { user } = useAuth();

  const settingsLinks = [
    {
      to: '/app/settings/account',
      icon: <UserIcon className="h-6 w-6" strokeWidth={2.5} />,
      title: 'Account',
      description: 'Manage your profile information and password.'
    },
    {
      to: '/app/settings/academic',
      icon: <GraduationCapIcon className="h-6 w-6" strokeWidth={2.5} />,
      title: 'Academic',
      description: 'Configure your semester, year, and subjects.'
    },
    {
      to: '/app/settings/notifications',
      icon: <BellIcon className="h-6 w-6" strokeWidth={2.5} />,
      title: 'Notifications',
      description: 'Manage your alerts and task reminders.'
    },
    {
      to: '/app/settings/appearance',
      icon: <PaletteIcon className="h-6 w-6" strokeWidth={2.5} />,
      title: 'Appearance',
      description: 'Customize the look and feel of your workspace.'
    },
    {
      to: '/app/settings/data',
      icon: <DatabaseIcon className="h-6 w-6" strokeWidth={2.5} />,
      title: 'Data & Advanced',
      description: 'Backups, exports, and danger zone.'
    }
  ];

  return (
    <div className="max-w-3xl">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your application preferences and account details." 
      />

      <div className="space-y-4">
        {/* Profile Summary Card (Optional nice touch for the hub) */}
        <Card className="mb-8 flex items-center gap-4 p-6 bg-sun dark:bg-white/5">
          {user?.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="h-14 w-14 rounded-full border-2 border-ink object-cover shadow-brut-xs"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-brand shadow-brut-xs text-white">
              <UserIcon className="h-7 w-7" strokeWidth={2} />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-display text-lg font-bold uppercase tracking-tight">{profile.name || 'User'}</h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <Link 
            to="/app/settings/account" 
            className="flex h-10 px-4 items-center justify-center border-2 border-ink bg-white font-display text-xs font-bold uppercase tracking-widest shadow-brut-xs hover:bg-gray-50 focus-brut text-ink"
          >
            Manage
          </Link>
        </Card>

        {settingsLinks.map((link) => (
          <Link 
            key={link.to} 
            to={link.to} 
            className="group block focus-brut"
          >
            <Card className="flex items-center gap-4 p-5 transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-brut">
              <div className="flex h-12 w-12 items-center justify-center border-2 border-ink bg-brand/10 text-brand">
                {link.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold uppercase tracking-tight group-hover:text-brand transition-colors">
                  {link.title}
                </h3>
                <p className="muted text-sm mt-0.5">{link.description}</p>
              </div>
              <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-ink transition-colors" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
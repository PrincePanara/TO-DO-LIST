import React from 'react';
import { NavLink } from 'react-router-dom';
import { MoonIcon, SunIcon, UserIcon } from 'lucide-react';
import { navItems } from './navItems';
import { useStudyForge } from '../../contexts/StudyForgeContext';

export function Sidebar() {
  const { profile, notifications, theme, toggleTheme } = useStudyForge();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <aside className="hidden lg:flex lg:w-[248px] xl:w-[268px] shrink-0 flex-col border-r-3 border-ink bg-white dark:border-white dark:bg-[#1c1b21]">
      <div className="flex items-center gap-3 border-b-3 border-ink px-5 py-5 dark:border-white">
        <span className="flex h-11 w-11 items-center justify-center border-3 border-ink bg-brand font-display text-lg font-bold text-white shadow-brut-xs dark:border-white">
          QL
        </span>
        <span>
          <span className="block font-display text-lg font-bold uppercase leading-none tracking-tight">
            QubesoLister
          </span>
          <span className="muted block text-[11px] uppercase tracking-[0.16em]">
            Semester {profile.semester}
          </span>
        </span>
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1.5">
          {navItems.map(({ label, to, icon: Icon }) =>
          <li key={to}>
              <NavLink
              to={to}
              className={({ isActive }) =>
              `flex items-center gap-3 border-3 px-3 py-2.5 font-display text-sm font-bold uppercase tracking-[0.06em] press focus-brut ${
              isActive ?
              'border-ink bg-brand text-white shadow-brut-xs dark:border-white' :
              'border-transparent hover:border-ink hover:bg-sun hover:text-ink dark:hover:border-white'}`

              }>
              
                <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2.6} aria-hidden />
                <span className="flex-1">{label}</span>
                {label === 'Notifications' && unread > 0 &&
              <span className="flex h-5 min-w-5 items-center justify-center border-[2px] border-ink bg-danger px-1 text-[11px] font-bold text-white">
                    {unread}
                  </span>
              }
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="border-t-3 border-ink p-3 dark:border-white">
        <NavLink
          to="/app/profile"
          className="mb-2 flex items-center gap-3 border-3 border-ink bg-sun px-3 py-2.5 press focus-brut dark:border-white">
          
          <span className="flex h-9 w-9 items-center justify-center border-3 border-ink bg-white text-ink">
            <UserIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
          </span>
          <span className="min-w-0 flex-1 text-ink">
            <span className="block truncate font-display text-sm font-bold uppercase leading-tight">
              {profile.name}
            </span>
            <span className="block truncate text-[11px] uppercase tracking-[0.12em] text-ink/70">
              {profile.branch}
            </span>
          </span>
        </NavLink>
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 border-3 border-ink px-3 py-2.5 font-display text-sm font-bold uppercase tracking-[0.06em] press focus-brut dark:border-white">
          
          {theme === 'light' ?
          <MoonIcon className="h-[18px] w-[18px]" strokeWidth={2.6} aria-hidden /> :

          <SunIcon className="h-[18px] w-[18px]" strokeWidth={2.6} aria-hidden />
          }
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </div>
    </aside>);

}
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BellIcon, MoonIcon, SearchIcon, SunIcon, UserIcon } from 'lucide-react';
import { useStudyForge } from '../../contexts/StudyForgeContext';
import { greeting, longDate } from '../../utils/date';
import { isoOffset } from '../../utils/date';

export function TopBar({ onOpenSearch }: {onOpenSearch: () => void;}) {
  const { profile, notifications, theme, toggleTheme } = useStudyForge();
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;
  const firstName = profile.name.split(' ')[0];

  return (
    <header className="sticky top-0 z-30 border-b-3 border-ink bg-white/95 backdrop-blur dark:border-white dark:bg-[#1c1b21]/95">
      <div className="flex h-[88px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-bold uppercase leading-tight tracking-tight sm:text-2xl">
            {greeting()}, {firstName.toUpperCase()} <span aria-hidden>👋</span>
          </p>
          <p className="muted text-xs sm:text-sm">{longDate(isoOffset(0))}</p>
        </div>

        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden items-center gap-3 border-3 border-ink bg-white px-3 py-2 text-left text-sm text-ink/60 shadow-brut-xs press focus-brut md:flex md:w-64 dark:border-white dark:bg-white/5 dark:text-white/60">
          
          <SearchIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
          <span className="flex-1">Search anything…</span>
          <kbd className="border-[2px] border-ink px-1.5 font-display text-[11px] font-bold dark:border-white">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Open search"
          className="flex h-10 w-10 items-center justify-center border-3 border-ink bg-white shadow-brut-xs press focus-brut md:hidden dark:border-white dark:bg-white/5">
          
          <SearchIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
        </button>

        <NavLink
          to="/app/notifications"
          aria-label={`Notifications, ${unread} unread`}
          className="relative flex h-10 w-10 items-center justify-center border-3 border-ink bg-sun shadow-brut-xs press focus-brut dark:border-white">
          
          <BellIcon className="h-4 w-4 text-ink" strokeWidth={3} aria-hidden />
          {unread > 0 &&
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center border-[2px] border-ink bg-danger px-1 font-display text-[11px] font-bold text-white">
              {unread}
            </span>
          }
        </NavLink>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          className="hidden h-10 w-10 items-center justify-center border-3 border-ink bg-white shadow-brut-xs press focus-brut sm:flex dark:border-white dark:bg-white/5">
          
          {theme === 'light' ?
          <MoonIcon className="h-4 w-4" strokeWidth={3} aria-hidden /> :

          <SunIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
          }
        </button>

        <button
          type="button"
          onClick={() => navigate('/app/profile')}
          aria-label="Open profile"
          className="hidden h-10 w-10 items-center justify-center border-3 border-ink bg-brand text-white shadow-brut-xs press focus-brut sm:flex dark:border-white">
          
          <UserIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
        </button>
      </div>
    </header>);

}
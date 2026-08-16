import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpenIcon,
  CalendarDaysIcon,
  HomeIcon,
  SquareCheckBigIcon,
  UserIcon } from
'lucide-react';

const items = [
{ label: 'Home', to: '/app/dashboard', icon: HomeIcon },
{ label: 'Tasks', to: '/app/tasks', icon: SquareCheckBigIcon },
{ label: 'Subjects', to: '/app/subjects', icon: BookOpenIcon },
{ label: 'Calendar', to: '/app/calendar', icon: CalendarDaysIcon },
{ label: 'Profile', to: '/app/profile', icon: UserIcon }];


export function MobileNav() {
  return (
    <nav
      aria-label="Primary mobile"
      className="fixed bottom-0 left-0 right-0 z-40 border-t-3 border-ink bg-white lg:hidden dark:border-white dark:bg-[#1c1b21]">
      
      <ul className="flex">
        {items.map(({ label, to, icon: Icon }) =>
        <li key={to} className="flex-1">
            <NavLink
            to={to}
            className={({ isActive }) =>
            `flex min-h-[60px] flex-col items-center justify-center gap-1 border-r-3 border-ink px-1 py-2 last:border-r-0 focus-brut dark:border-white ${
            isActive ? 'bg-brand text-white' : 'text-ink dark:text-white'}`

            }>
            
              <Icon className="h-5 w-5" strokeWidth={2.8} aria-hidden />
              <span className="font-display text-[10px] font-bold uppercase tracking-[0.08em]">
                {label}
              </span>
            </NavLink>
          </li>
        )}
      </ul>
    </nav>);

}
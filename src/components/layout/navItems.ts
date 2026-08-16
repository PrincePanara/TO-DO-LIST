import {
  BellIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  FlaskConicalIcon,
  LayoutDashboardIcon,
  NotebookPenIcon,
  RocketIcon,
  SettingsIcon,
  SquareCheckBigIcon,
  TableIcon,
  TrendingUpIcon } from
'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: typeof BellIcon;
}

export const navItems: NavItem[] = [
{ label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboardIcon },
{ label: 'Tasks', to: '/app/tasks', icon: SquareCheckBigIcon },
{ label: 'Subjects', to: '/app/subjects', icon: BookOpenIcon },
{ label: 'Timetable', to: '/app/timetable', icon: TableIcon },
{ label: 'Calendar', to: '/app/calendar', icon: CalendarDaysIcon },
{ label: 'Class Work', to: '/app/class-work', icon: ClipboardListIcon },
{ label: 'Lab Work', to: '/app/lab-work', icon: FlaskConicalIcon },
{ label: 'Projects', to: '/app/projects', icon: RocketIcon },
{ label: 'Notes', to: '/app/notes', icon: NotebookPenIcon },
{ label: 'Progress', to: '/app/progress', icon: TrendingUpIcon },
{ label: 'Notifications', to: '/app/notifications', icon: BellIcon },
{ label: 'Settings', to: '/app/settings', icon: SettingsIcon }];
import {
  addDays,
  differenceInCalendarDays,
  format,
  isSameDay,
  parseISO,
  startOfDay } from
'date-fns';

/** ISO date (yyyy-MM-dd) offset from today. Used for seed data and previews. */
export function isoOffset(days: number): string {
  return format(addDays(new Date(), days), 'yyyy-MM-dd');
}

export function toDate(iso: string): Date {
  if (!iso) return new Date();
  return startOfDay(parseISO(iso));
}

export function isToday(iso: string): boolean {
  return isSameDay(toDate(iso), new Date());
}

export function daysUntil(iso: string): number {
  if (!iso) return 0;
  return differenceInCalendarDays(toDate(iso), startOfDay(new Date()));
}

export function isOverdue(iso: string): boolean {
  return daysUntil(iso) < 0;
}

/** "TODAY" / "TOMORROW" / "18 AUG" / "2 DAYS AGO" */
export function dueLabel(iso?: string | null): string {
  if (!iso) return 'N/A';
  const diff = daysUntil(iso);
  if (diff === 0) return 'TODAY';
  if (diff === 1) return 'TOMORROW';
  if (diff === -1) return 'YESTERDAY';
  if (diff < -1) return `${Math.abs(diff)} DAYS AGO`;
  return format(toDate(iso), 'd MMM').toUpperCase();
}

export function longDate(iso: string): string {
  return format(toDate(iso), 'EEEE, MMMM d');
}

export function shortDate(iso: string): string {
  return format(toDate(iso), 'd MMM yyyy');
}

export function greeting(): string {
  return 'NAMASTE';
}

export function time12(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}
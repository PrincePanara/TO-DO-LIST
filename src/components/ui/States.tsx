import React from 'react';
import { twMerge } from 'tailwind-merge';
import { AlertTriangleIcon } from 'lucide-react';
import { Card } from './Card';

export function EmptyState({
  icon,
  title,
  subtitle,
  actions,
  className






}: {icon?: React.ReactNode;title: string;subtitle?: string;actions?: React.ReactNode;className?: string;}) {
  return (
    <Card
      className={twMerge(
        'grid-paper flex flex-col items-center gap-4 border-dashed px-6 py-14 text-center',
        className
      )}
      shadow="sm">
      
      {icon &&
      <div className="flex h-16 w-16 items-center justify-center border-3 border-ink bg-sun shadow-brut-xs dark:border-white">
          {icon}
        </div>
      }
      <h3 className="font-display text-2xl font-bold uppercase tracking-tight">{title}</h3>
      {subtitle && <p className="muted max-w-md text-sm">{subtitle}</p>}
      {actions && <div className="mt-1 flex flex-wrap justify-center gap-3">{actions}</div>}
    </Card>);

}

export function ErrorState({
  title,
  subtitle,
  actions




}: {title: string;subtitle: string;actions?: React.ReactNode;}) {
  return (
    <Card className="flex flex-col items-center gap-4 px-6 py-12 text-center" tone="white">
      <div className="flex h-16 w-16 items-center justify-center border-3 border-ink bg-danger shadow-brut-xs dark:border-white">
        <AlertTriangleIcon className="h-8 w-8 text-white" strokeWidth={3} />
      </div>
      <h3 className="font-display text-2xl font-bold uppercase tracking-tight">{title}</h3>
      <p className="muted max-w-md text-sm">{subtitle}</p>
      {actions && <div className="flex flex-wrap justify-center gap-3">{actions}</div>}
    </Card>);

}

export function SkeletonBlock({ className }: {className?: string;}) {
  return (
    <div
      className={twMerge(
        'animate-pulse border-3 border-ink bg-ink/10 dark:border-white dark:bg-white/10',
        className
      )} />);


}

export function SkeletonCard() {
  return (
    <Card className="space-y-3 p-5" shadow="sm">
      <SkeletonBlock className="h-4 w-24" />
      <SkeletonBlock className="h-7 w-3/4" />
      <SkeletonBlock className="h-4 w-1/2" />
      <SkeletonBlock className="h-4 w-full" />
    </Card>);

}

export function LoadingList({ count = 3, text }: {count?: number;text?: string;}) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      {text &&
      <p className="font-display text-xs font-bold uppercase tracking-[0.18em]">{text}</p>
      }
      {Array.from({ length: count }).map((_, i) =>
      <SkeletonCard key={i} />
      )}
    </div>);

}
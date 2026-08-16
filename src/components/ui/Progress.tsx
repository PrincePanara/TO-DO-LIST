import React from 'react';
import { twMerge } from 'tailwind-merge';

export type ProgressTone = 'purple' | 'yellow' | 'red' | 'green' | 'ink';

const fills: Record<ProgressTone, string> = {
  purple: 'bg-brand',
  yellow: 'bg-sun',
  red: 'bg-danger',
  green: 'bg-ok',
  ink: 'bg-ink dark:bg-white'
};

export function ProgressBar({
  value,
  tone = 'purple',
  height = 'md',
  showValue = false,
  label,
  className







}: {value: number;tone?: ProgressTone;height?: 'sm' | 'md' | 'lg';showValue?: boolean;label?: string;className?: string;}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const h = height === 'sm' ? 'h-3' : height === 'lg' ? 'h-6' : 'h-4';
  return (
    <div className={className}>
      {(label || showValue) &&
      <div className="mb-1.5 flex items-center justify-between font-display text-[11px] font-bold uppercase tracking-[0.12em]">
          <span>{label}</span>
          {showValue && <span>{clamped}%</span>}
        </div>
      }
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Progress'}
        className={twMerge('w-full border-3 border-ink bg-white dark:border-white dark:bg-white/10', h)}>
        
        <div
          className={twMerge('h-full transition-[width] duration-300 ease-brut', fills[tone])}
          style={{ width: `${clamped}%` }} />
        
      </div>
    </div>);

}

export function StatRing({ value, caption }: {value: number;caption: string;}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-display text-5xl font-bold leading-none">{clamped}%</span>
      <span className="font-display text-xs font-bold uppercase tracking-[0.14em]">{caption}</span>
    </div>);

}
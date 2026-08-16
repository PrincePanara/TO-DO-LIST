import React from 'react';
import { twMerge } from 'tailwind-merge';

export type CardTone = 'white' | 'purple' | 'yellow' | 'red' | 'green' | 'ink';

const tones: Record<CardTone, string> = {
  white: 'surface',
  purple: 'bg-brand text-white border-3 border-ink',
  yellow: 'bg-sun text-ink border-3 border-ink',
  red: 'bg-danger text-white border-3 border-ink',
  green: 'bg-ok text-ink border-3 border-ink',
  ink: 'bg-ink text-white border-3 border-ink dark:border-white'
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'section' | 'article' | 'li';
}

export function Card({
  tone = 'white',
  shadow = 'md',
  as: Tag = 'div',
  className,
  children,
  ...rest
}: CardProps) {
  const shadowClass =
  shadow === 'none' ?
  '' :
  shadow === 'sm' ?
  'shadow-brut-sm' :
  shadow === 'lg' ?
  'shadow-brut-lg' :
  'shadow-brut';
  return (
    <Tag {...rest} className={twMerge(tones[tone], shadowClass, className)}>
      {children}
    </Tag>);

}

export function SectionHeading({
  title,
  action,
  hint,
  className





}: {title: string;hint?: string;action?: React.ReactNode;className?: string;}) {
  return (
    <div className={twMerge('mb-4 flex flex-wrap items-end justify-between gap-3', className)}>
      <div>
        <h2 className="font-display text-xl font-bold uppercase tracking-tight sm:text-2xl">
          {title}
        </h2>
        {hint && <p className="muted mt-1 text-sm">{hint}</p>}
      </div>
      {action}
    </div>);

}
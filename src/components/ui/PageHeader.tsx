import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SearchIcon } from 'lucide-react';

export function PageHeader({
  title,
  subtitle,
  actions,
  backTo,
  backLabel,
  eyebrow







}: {title: string;subtitle?: string;actions?: React.ReactNode;backTo?: string;backLabel?: string;eyebrow?: React.ReactNode;}) {
  return (
    <div className="mb-6">
      {backTo &&
      <Link
        to={backTo}
        className="mb-3 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.14em] underline decoration-[3px] underline-offset-4 focus-brut">
        
          <ArrowLeftIcon className="h-4 w-4" strokeWidth={3} aria-hidden />
          {backLabel ?? 'Back'}
        </Link>
      }
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && <div className="mb-2 flex flex-wrap items-center gap-2">{eyebrow}</div>}
          <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && <p className="muted mt-3 max-w-2xl text-sm sm:text-base">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </div>);

}

export function SearchField({
  value,
  onChange,
  placeholder,
  label





}: {value: string;onChange: (v: string) => void;placeholder: string;label: string;}) {
  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
        strokeWidth={3}
        aria-hidden />
      
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="brut-input pl-12" />
      
    </div>);

}

export function FilterTabs<T extends string>({
  value,
  onChange,
  options,
  label





}: {value: T;onChange: (v: T) => void;options: {value: T;label: string;count?: number;}[];label: string;}) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label={label}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`flex items-center gap-2 border-3 px-3.5 py-2 font-display text-xs font-bold uppercase tracking-[0.1em] press focus-brut ${
            active ?
            'border-ink bg-brand text-white shadow-brut-xs dark:border-white' :
            'border-ink bg-white text-ink dark:border-white dark:bg-white/5 dark:text-white'}`
            }>
            
            {o.label}
            {typeof o.count === 'number' &&
            <span
              className={`border-[2px] px-1.5 font-mono text-[11px] ${
              active ? 'border-white/70' : 'border-ink dark:border-white'}`
              }>
              
                {o.count}
              </span>
            }
          </button>);

      })}
    </div>);

}
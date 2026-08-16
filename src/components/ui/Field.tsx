import React from 'react';
import { twMerge } from 'tailwind-merge';
import { ChevronDownIcon } from 'lucide-react';

let uid = 0;
const nextId = (prefix: string) => `${prefix}-${++uid}`;

export function Field({
  label,
  hint,
  error,
  children,
  className






}: {label: string;hint?: string;error?: string;children: React.ReactNode;className?: string;}) {
  return (
    <label className={twMerge('block', className)}>
      <span className="brut-label">{label}</span>
      {children}
      {hint && !error && <span className="muted mt-1.5 block text-xs">{hint}</span>}
      {error &&
      <span className="mt-1.5 block font-display text-xs font-bold uppercase text-danger">
          {error}
        </span>
      }
    </label>);

}

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export function TextInput({ label, hint, error, wrapperClassName, className, ...rest }: TextInputProps) {
  const id = React.useRef(nextId('input')).current;
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="brut-label">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        aria-invalid={!!error}
        className={twMerge('brut-input', error && 'border-danger', className)} />
      
      {hint && !error && <p className="muted mt-1.5 text-xs">{hint}</p>}
      {error &&
      <p className="mt-1.5 font-display text-xs font-bold uppercase text-danger">{error}</p>
      }
    </div>);

}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  wrapperClassName?: string;
}

export function TextArea({ label, hint, wrapperClassName, className, ...rest }: TextAreaProps) {
  const id = React.useRef(nextId('textarea')).current;
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="brut-label">
        {label}
      </label>
      <textarea id={id} rows={4} {...rest} className={twMerge('brut-input resize-y', className)} />
      {hint && <p className="muted mt-1.5 text-xs">{hint}</p>}
    </div>);

}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: {value: string;label: string;}[];
  wrapperClassName?: string;
}

export function Select({ label, options, wrapperClassName, className, ...rest }: SelectProps) {
  const id = React.useRef(nextId('select')).current;
  return (
    <div className={wrapperClassName}>
      <label htmlFor={id} className="brut-label">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          {...rest}
          className={twMerge('brut-input appearance-none pr-12 font-display font-bold uppercase', className)}>
          
          {options.map((o) =>
          <option key={o.value} value={o.value}>
              {o.label}
            </option>
          )}
        </select>
        <ChevronDownIcon
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2"
          strokeWidth={3} />
        
      </div>
    </div>);

}

export function Toggle({
  label,
  description,
  checked,
  onChange





}: {label: string;description?: string;checked: boolean;onChange: (v: boolean) => void;}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>
        <span className="block font-display text-sm font-bold uppercase tracking-[0.08em]">
          {label}
        </span>
        {description && <span className="muted block text-xs">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={twMerge(
          'relative h-8 w-16 shrink-0 border-3 border-ink shadow-brut-xs press focus-brut dark:border-white',
          checked ? 'bg-ok' : 'bg-white dark:bg-white/10'
        )}>
        
        <span
          className={twMerge(
            'absolute top-0 h-[26px] w-7 border-r-3 border-ink bg-ink transition-transform duration-150 ease-brut dark:border-white',
            checked ? 'translate-x-[34px]' : 'translate-x-0'
          )} />
        
      </button>
    </div>);

}

export function ChipGroup<T extends string>({
  label,
  value,
  options,
  onChange





}: {label: string;value: T;options: {value: T;label: string;}[];onChange: (v: T) => void;}) {
  return (
    <div>
      <span className="brut-label">{label}</span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={twMerge(
                'border-3 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.08em] press focus-brut',
                active ? 'bg-ink text-white border-ink shadow-brut-xs dark:border-white' : 'surface'
              )}>
              
              {o.label}
            </button>);

        })}
      </div>
    </div>);

}
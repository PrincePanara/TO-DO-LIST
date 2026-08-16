import React from 'react';
import { twMerge } from 'tailwind-merge';

type Variant = 'primary' | 'sun' | 'danger' | 'ok' | 'white' | 'ink' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white border-ink',
  sun: 'bg-sun text-ink border-ink',
  danger: 'bg-danger text-white border-ink',
  ok: 'bg-ok text-ink border-ink',
  white: 'surface',
  ink: 'bg-ink text-white border-ink dark:border-white',
  ghost: 'bg-transparent border-transparent shadow-none hover:bg-ink/5'
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base'
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={twMerge(
        'inline-flex items-center justify-center gap-2 border-3 font-display font-bold uppercase tracking-[0.08em] press focus-brut disabled:opacity-50 disabled:pointer-events-none',
        variant === 'ghost' ? '' : 'shadow-brut-sm',
        variants[variant],
        sizes[size],
        block && 'w-full',
        className
      )}>
      
      {children}
    </button>);

}

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: Variant;
}

export function IconButton({ label, variant = 'white', className, children, ...rest }: IconButtonProps) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={twMerge(
        'inline-flex h-10 w-10 items-center justify-center border-3 shadow-brut-xs press focus-brut',
        variants[variant],
        className
      )}>
      
      {children}
    </button>);

}
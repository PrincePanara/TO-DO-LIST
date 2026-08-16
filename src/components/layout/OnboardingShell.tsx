import React from 'react';
import { Link } from 'react-router-dom';

export function OnboardingShell({
  step,
  children



}: {step?: string;children: React.ReactNode;}) {
  return (
    <div className="relative min-h-screen w-full bg-canvas pb-16">
      <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden />
      <header className="relative z-10 flex items-center justify-between gap-4 border-b-3 border-ink bg-white px-4 py-4 sm:px-8">
        <Link to="/" className="flex items-center gap-3 focus-brut">
          <span className="flex h-10 w-10 items-center justify-center border-3 border-ink bg-brand font-display font-bold text-white">
            SF
          </span>
          <span className="font-display text-lg font-bold uppercase tracking-tight">StudyForge</span>
        </Link>
        {step &&
        <span className="border-3 border-ink bg-sun px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.16em] shadow-brut-xs">
            {step}
          </span>
        }
      </header>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        {children}
      </div>
    </div>);

}
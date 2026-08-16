import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { AddMenu } from './AddMenu';
import { CommandPalette } from '../search/CommandPalette';
import { Toaster } from '../ui/Toaster';
import { useStudyForge } from '../../contexts/StudyForgeContext';

export function AppShell() {
  const { onboarded, profileLoaded } = useStudyForge();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === 'Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Wait for Firestore profile to load before checking onboarding status
  if (!profileLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-ink border-t-transparent" />
      </div>
    );
  }

  // Profile loaded but onboarding not completed → send to onboarding
  if (!onboarded) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <div className="flex min-h-screen w-full bg-canvas dark:bg-[#17161a]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenSearch={() => setSearchOpen(true)} />
        <main className="flex-1 px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-16">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
      <AddMenu />
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Toaster />
    </div>);

}
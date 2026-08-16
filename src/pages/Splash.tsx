import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useStudyForge } from '../contexts/StudyForgeContext';

const ease = [0.23, 1, 0.32, 1] as const;

export function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { onboarded, profileLoaded } = useStudyForge();
  const [progress, setProgress] = useState(8);
  const [ready, setReady] = useState(false); // true once we know where to go

  // Determine destination once all async state is settled
  useEffect(() => {
    if (authLoading) return; // wait for Firebase auth to resolve

    if (!isAuthenticated) {
      // Not logged in → go to login after splash
      const t = window.setTimeout(() => navigate('/login'), 1900);
      return () => window.clearTimeout(t);
    }

    // Authenticated — wait for Firestore profile to load
    if (!profileLoaded) return;

    // Both resolved: pick destination
    const destination = onboarded ? '/app/dashboard' : '/welcome';
    setReady(true);

    const t = window.setTimeout(() => navigate(destination), 1900);
    return () => window.clearTimeout(t);
  }, [authLoading, isAuthenticated, profileLoaded, onboarded, navigate]);

  // Progress bar animation (runs always, independent of routing)
  useEffect(() => {
    const tick = window.setInterval(
      () => setProgress((p) => Math.min(100, p + 9)),
      130
    );
    return () => window.clearInterval(tick);
  }, []);

  const skipDestination = () => {
    if (!isAuthenticated) return '/login';
    if (!profileLoaded) return '/login';
    return onboarded ? '/app/dashboard' : '/welcome';
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas px-6">
      <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden />

      <motion.div
        aria-hidden
        initial={{ x: -120, y: -40, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
        className="absolute left-[6%] top-[18%] h-28 w-40 border-3 border-ink bg-brand shadow-brut" />

      <motion.div
        aria-hidden
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.08, ease }}
        className="absolute bottom-[16%] left-[16%] h-24 w-24 rounded-full border-3 border-ink bg-sun shadow-brut" />

      <motion.div
        aria-hidden
        initial={{ x: 120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.14, ease }}
        className="absolute right-[10%] top-[24%] h-16 w-16 border-3 border-ink bg-danger shadow-brut" />

      <motion.div
        aria-hidden
        initial={{ x: 100, y: 80, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease }}
        className="absolute bottom-[20%] right-[12%] h-28 w-28 border-3 border-ink" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.span
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, ease }}
          className="mb-6 flex h-24 w-24 items-center justify-center border-3 border-ink bg-brand font-display text-4xl font-bold text-white shadow-brut-lg">
          SF
        </motion.span>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.12, ease }}
          className="font-display text-5xl font-bold uppercase leading-none tracking-tight sm:text-7xl">
          StudyForge
        </motion.h1>

        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2, ease }}
          className="mt-3 font-display text-sm font-bold uppercase tracking-[0.34em]">
          Build. Learn. Complete.
        </motion.p>

        <div
          className="mt-10 w-64 border-3 border-ink bg-white"
          role="progressbar"
          aria-label="Loading StudyForge"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}>
          <div
            className="h-4 bg-ink transition-[width] duration-150 ease-brut"
            style={{ width: `${progress}%` }} />
        </div>

        <button
          type="button"
          onClick={() => navigate(skipDestination())}
          className="mt-5 font-display text-xs font-bold uppercase tracking-[0.2em] underline decoration-[3px] underline-offset-4 focus-brut">
          Skip intro
        </button>
      </div>
    </div>
  );
}
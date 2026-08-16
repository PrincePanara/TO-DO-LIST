import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, UserIcon } from 'lucide-react';
import { auth } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';

const ease = [0.23, 1, 0.32, 1] as const;

const DASHBOARD = '/app/dashboard';
function goToDashboard() { window.location.replace(DASHBOARD); }

function friendlyError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return 'Failed to create account. Please try again.';
  }
}

function Field({
  label, id, type, value, onChange, error, placeholder, icon, rightSlot,
}: {
  label: string; id: string; type: string; value: string;
  onChange: (v: string) => void; error?: string; placeholder?: string;
  icon: React.ReactNode; rightSlot?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-display text-[11px] font-bold uppercase tracking-[0.16em] text-ink/70 dark:text-white/60">
        {label}
      </label>
      <div className={`flex items-center border-3 bg-white transition-colors dark:bg-white/5 ${error ? 'border-danger' : 'border-ink dark:border-white/60 focus-within:border-brand dark:focus-within:border-brand'}`}>
        <span className="flex h-11 w-10 shrink-0 items-center justify-center text-ink/40 dark:text-white/30">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={
            type === 'password' ? (id.includes('confirm') ? 'new-password' : 'new-password')
              : type === 'email' ? 'email'
              : id === 'signup-name' ? 'name'
              : 'off'
          }
          className="h-11 flex-1 bg-transparent pr-3 text-sm font-medium text-ink outline-none placeholder:text-ink/30 dark:text-white dark:placeholder:text-white/20"
        />
        {rightSlot}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 text-xs font-bold text-danger"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Signup() {
  const { user, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string; email?: string; password?: string; confirm?: string; form?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  // Already authenticated → skip sign-up
  useEffect(() => {
    if (!authLoading && user) goToDashboard();
  }, [user, authLoading]);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    if (!confirmPassword) e.confirm = 'Please confirm your password.';
    else if (password !== confirmPassword) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Save the user's display name
      await updateProfile(credential.user, { displayName: name.trim() });
      // New user → Splash first, then Splash routes to onboarding
      window.location.replace('/');
    } catch (err: any) {
      setErrors({ form: friendlyError(err?.code ?? '') });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center border-3 border-ink bg-brand font-display text-2xl font-bold text-white shadow-brut">SF</span>
          <span className="inline-block h-6 w-6 animate-spin rounded-full border-3 border-ink border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-canvas px-6 py-12">
      <div className="grid-paper pointer-events-none absolute inset-0" aria-hidden />

      {/* Decorative shapes */}
      <motion.div aria-hidden initial={{ x: -120, y: -40, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ duration: 0.6, ease }} className="absolute left-[6%] top-[8%] h-28 w-40 border-3 border-ink bg-brand shadow-brut" />
      <motion.div aria-hidden initial={{ y: 120, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.08, ease }} className="absolute bottom-[10%] left-[14%] h-20 w-20 rounded-full border-3 border-ink bg-sun shadow-brut" />
      <motion.div aria-hidden initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.14, ease }} className="absolute right-[8%] top-[16%] h-16 w-16 border-3 border-ink bg-danger shadow-brut" />
      <motion.div aria-hidden initial={{ x: 100, y: 80, opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2, ease }} className="absolute bottom-[14%] right-[10%] h-24 w-24 border-3 border-ink" />

      <motion.div
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease }}
        className="relative z-10 w-full max-w-sm border-3 border-ink bg-white shadow-brut-lg dark:bg-zinc-900 dark:text-white"
      >
        {/* Brand header */}
        <div className="border-b-3 border-ink bg-brand px-8 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center border-3 border-ink bg-white font-display text-base font-bold text-ink shadow-brut-sm">SF</span>
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">StudyForge</p>
              <p className="font-display text-[10px] font-bold uppercase tracking-[0.15em] text-white/70">Build · Learn · Complete</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-9">
          <h1 className="font-display text-3xl font-bold uppercase leading-none tracking-tight">Create account</h1>
          <p className="mt-1.5 text-sm text-ink/55 dark:text-white/50">Join StudyForge to organize your academic life.</p>

          <form onSubmit={handleSignup} noValidate className="mt-8 space-y-5">
            <Field
              id="signup-name"
              label="Full Name"
              type="text"
              value={name}
              onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: undefined, form: undefined })); }}
              error={errors.name}
              placeholder="Your full name"
              icon={<UserIcon className="h-4 w-4" strokeWidth={2.5} />}
            />

            <Field
              id="signup-email"
              label="Email"
              type="email"
              value={email}
              onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined, form: undefined })); }}
              error={errors.email}
              placeholder="you@example.com"
              icon={<MailIcon className="h-4 w-4" strokeWidth={2.5} />}
            />

            <Field
              id="signup-password"
              label="Password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(v) => { setPassword(v); setErrors((e) => ({ ...e, password: undefined, form: undefined })); }}
              error={errors.password}
              placeholder="Min. 6 characters"
              icon={<LockIcon className="h-4 w-4" strokeWidth={2.5} />}
              rightSlot={
                <button type="button" onClick={() => setShowPw((s) => !s)} className="flex h-11 w-10 shrink-0 items-center justify-center text-ink/40 hover:text-ink dark:text-white/30 dark:hover:text-white" aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOffIcon className="h-4 w-4" strokeWidth={2.5} /> : <EyeIcon className="h-4 w-4" strokeWidth={2.5} />}
                </button>
              }
            />

            <Field
              id="signup-confirm-password"
              label="Confirm Password"
              type={showConfirmPw ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(v) => { setConfirmPassword(v); setErrors((e) => ({ ...e, confirm: undefined, form: undefined })); }}
              error={errors.confirm}
              placeholder="Re-enter your password"
              icon={<LockIcon className="h-4 w-4" strokeWidth={2.5} />}
              rightSlot={
                <button type="button" onClick={() => setShowConfirmPw((s) => !s)} className="flex h-11 w-10 shrink-0 items-center justify-center text-ink/40 hover:text-ink dark:text-white/30 dark:hover:text-white" aria-label={showConfirmPw ? 'Hide password' : 'Show password'}>
                  {showConfirmPw ? <EyeOffIcon className="h-4 w-4" strokeWidth={2.5} /> : <EyeIcon className="h-4 w-4" strokeWidth={2.5} />}
                </button>
              }
            />

            <AnimatePresence>
              {errors.form && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="border-3 border-danger bg-danger/10 px-4 py-3 text-center text-xs font-bold text-danger"
                >
                  {errors.form}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="mt-1 flex w-full items-center justify-center border-3 border-ink bg-brand px-5 py-3 font-display text-sm font-bold uppercase tracking-[0.1em] text-white shadow-brut-sm transition-all press focus-brut hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? <span className="inline-block h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent" />
                : 'Create Account'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm font-medium text-ink/60 dark:text-white/50">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand underline decoration-[2px] underline-offset-3 hover:text-brand/80">
              Log In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

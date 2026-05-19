'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setPending(true);
    try {
      const r = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (r.ok) {
        router.replace(next);
        router.refresh();
      } else {
        const j = await r.json().catch(() => ({}));
        setError(j.error || 'Login failed');
        setPending(false);
      }
    } catch {
      setError('Network error');
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xs text-white">
      <div className="mb-10 text-center">
        <div className="text-zinc-500 text-xs tracking-[0.3em] uppercase mb-2">Mobile Workout</div>
        <h1 className="font-display text-7xl leading-none">FORGE</h1>
        <div className="mt-4 h-[3px] w-12 bg-lime-400 mx-auto" />
      </div>
      <label className="block text-zinc-500 text-[10px] uppercase tracking-[0.3em] mb-2">Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        autoComplete="current-password"
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-mono focus:outline-none focus:border-lime-400"
      />
      {error && <div className="mt-3 text-red-400 text-xs font-mono">{error}</div>}
      <button
        type="submit"
        disabled={pending || !password}
        className="w-full mt-6 bg-lime-400 text-black py-4 rounded-xl font-bold text-xs uppercase tracking-[0.2em] active:bg-lime-500 disabled:opacity-40"
      >
        {pending ? 'Checking…' : 'Enter'}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-dvh flex items-center justify-center px-6"
      style={{ backgroundColor: '#09090b' }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

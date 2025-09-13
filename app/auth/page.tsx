'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function AuthPage() {
  const { user, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  const send = async () => {
    setErr(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin } });
    if (error) setErr(error.message); else setSent(true);
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Вы вошли</h2>
          <div className="text-white/80 break-all">{user.email ?? user.phone}</div>
          <div className="mt-4 flex gap-2">
            <Link href="/" className="btn btn-primary">На главную</Link>
            <button onClick={signOut} className="btn btn-ghost">Выйти</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="glass rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold">Вход по email</h2>
        <input className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none"
               placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <button onClick={send} disabled={!email || sent} className="btn btn-primary">{sent? 'Ссылка отправлена' : 'Отправить ссылку'}</button>
        {err && <div className="text-red-400 text-sm">{err}</div>}
      </div>
    </div>
  );
}

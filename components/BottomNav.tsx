'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { Route } from 'next';
import { supabaseBrowser } from '@/lib/supabase-browser';

export default function BottomNav() {
  const pathname = (usePathname() || '/') as Route;

  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabaseBrowser.auth.getSession().then(({ data }) => setAuthed(Boolean(data.session)));
  }, []);

  const authHref = useMemo<Route>(() => (authed ? '/account' : '/auth') as Route, [authed]);

  const items = useMemo<Array<{ href: Route; label: string }>>(
    () => [
      { href: '/' as Route, label: 'Главная' },
      { href: '/client' as Route, label: 'Заказ' },
      { href: '/executor' as Route, label: 'Исполнитель' },
      { href: '/admin' as Route, label: 'Админ' },
      { href: authHref, label: authed ? 'Кабинет' : 'Войти' },
    ],
    [authHref, authed]
  );

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40">
      <div className="mx-auto max-w-md px-3">
        <div className="glass rounded-2xl p-2 flex items-center justify-between">
          {items.map((it) => (
            <Link
              key={it.label}
              href={it.href}
              className={`px-3 py-2 text-sm rounded-xl ${
                pathname === it.href
                  ? 'bg-white text-black'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

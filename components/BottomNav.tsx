'use client';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';

const items: { href: Route; label: string }[] = [
  { href: '/', label: 'Главная' },
  { href: '/client', label: 'Заказ' },
  { href: '/executor', label: 'Исполнитель' },
  { href: '/admin', label: 'Админ' },
];

export default function BottomNav(){
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40">
      <div className="mx-auto max-w-md px-3">
        <div className="glass rounded-2xl p-2 flex items-center justify-between">
          {items.map(it => (
            <Link
              key={it.href}
              href={it.href}
              className={`px-3 py-2 text-sm rounded-xl ${pathname===it.href ? 'bg-white text-black' : 'text-white/80 hover:text-white hover:bg-white/10'}`}
            >
              {it.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

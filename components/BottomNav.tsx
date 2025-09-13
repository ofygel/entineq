'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/lib/store';

export default function BottomNav(){
  const pathname = usePathname();
  const { workspace } = useUI();

  const items =
    workspace === 'EXECUTOR' ? [
      { href: '/', label: 'Главная' },
      { href: '/executor', label: 'Исполнитель' },
      { href: '/account', label: 'Кабинет' },
    ]
    : workspace === 'ADMIN' ? [
      { href: '/', label: 'Главная' },
      { href: '/admin', label: 'Админ' },
      { href: '/account', label: 'Кабинет' },
    ]
    : [ // CLIENT или пусто
      { href: '/', label: 'Главная' },
      { href: '/client', label: 'Заказ' },
      { href: '/account', label: 'Кабинет' },
    ];

  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40">
      <div className="mx-auto container-mobile">
        <div className="glass rounded-3xl p-1.5 flex items-center justify-between">
          {items.map(it => {
            const active = pathname === it.href;
            return (
              <Link key={it.href} href={it.href}
                className={`px-4 py-2.5 text-sm rounded-2xl transition ${active? 'bg-white text-black' : 'text-white/85 hover:text-white hover:bg-white/10'}`}>
                {it.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';
import { useUI } from '@/lib/store';

export default function AccountPage() {
  const { role, mode, setRole, setMode } = useUI();

  return (
    <div className="flex-1 flex flex-col">
      <div className="container-mobile max-w-md mx-auto w-full p-4 pb-24 space-y-4">
        {/* Текущий контекст */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4"
        >
          <div className="text-lg font-semibold mb-2">Личный кабинет</div>
          <div className="text-sm text-white/70">
            Текущая роль: <span className="font-semibold text-white">{role ?? 'не выбрана'}</span>
          </div>
          <div className="text-sm text-white/70">
            Текущий режим клиента: <span className="font-semibold text-white">{mode ?? '—'}</span>
          </div>
        </motion.div>

        {/* Переключение ролей */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4"
        >
          <div className="text-lg font-semibold mb-3">Роль</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setRole('CLIENT')}
              className={`btn ${role === 'CLIENT' ? 'btn-primary text-black' : 'btn-ghost'}`}
            >
              Клиент
            </button>
            <button
              onClick={() => setRole('EXECUTOR')}
              className={`btn ${role === 'EXECUTOR' ? 'btn-primary text-black' : 'btn-ghost'}`}
            >
              Исполнитель
            </button>
            <button
              onClick={() => setRole('ADMIN')}
              className={`btn ${role === 'ADMIN' ? 'btn-primary text-black' : 'btn-ghost'}`}
            >
              Админ
            </button>
          </div>
          <p className="mt-3 text-xs text-white/60">
            Роль влияет на доступные экраны и действия. В проде это определяется сервером/БД (RLS), а не клиентом.
          </p>
        </motion.div>

        {/* Предпочтение режима для клиента */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4"
        >
          <div className="text-lg font-semibold mb-3">Режим клиента</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('taxi')}
              className={`btn ${mode === 'taxi' ? 'btn-primary text-black' : 'btn-ghost'}`}
            >
              Такси
            </button>
            <button
              onClick={() => setMode('delivery')}
              className={`btn ${mode === 'delivery' ? 'btn-primary text-black' : 'btn-ghost'}`}
            >
              Доставка
            </button>
          </div>
          <p className="mt-3 text-xs text-white/60">
            Здесь сохраняется предпочтение для стартового экрана клиента.
          </p>
        </motion.div>

        {/* Быстрые действия */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-4"
        >
          <div className="text-lg font-semibold mb-3">Быстрые действия</div>
          <div className="grid grid-cols-2 gap-2">
            <Link href="/client" className="btn btn-ghost text-center">К экранам клиента</Link>
            <Link href="/executor" className="btn btn-ghost text-center">К экранам исполнителя</Link>
            <Link href="/admin" className="btn btn-ghost text-center">Админ-панель</Link>
            <Link href="/" className="btn btn-ghost text-center">На главную</Link>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}

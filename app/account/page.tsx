'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUI } from '@/lib/store';
import BottomNav from '@/components/BottomNav';

export default function AccountPage(){
  const { roles, workspace, setWorkspace, addRole, removeRole, setMode } = useUI();

  const toggleRole = (r: 'CLIENT'|'EXECUTOR'|'ADMIN') => {
    if (roles.includes(r)) removeRole(r); else addRole(r);
  };

  return (
    <div className="flex-1 flex flex-col container-mobile pt-safe pb-safe space-y-4">
      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="card">
        <div className="text-lg font-semibold mb-3">Ваши роли</div>
        <div className="grid grid-cols-3 gap-2">
          {(['CLIENT','EXECUTOR','ADMIN'] as const).map(r => (
            <button key={r} onClick={()=>toggleRole(r)} className={`btn ${roles.includes(r)?'btn-primary text-black':'btn-ghost'}`}>
              {r==='CLIENT'?'Клиент':r==='EXECUTOR'?'Исполнитель':'Админ'}
            </button>
          ))}
        </div>
        <div className="text-xs text-white/60 mt-2">Можно иметь несколько ролей — это доступы. Текущий контекст выбирается ниже.</div>
      </motion.div>

      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="card">
        <div className="text-lg font-semibold mb-3">Текущий контекст</div>
        <div className="grid grid-cols-3 gap-2">
          {(['CLIENT','EXECUTOR','ADMIN'] as const).map(r => (
            <button key={r} disabled={!roles.includes(r)} onClick={()=>setWorkspace(r)}
              className={`btn ${workspace===r?'btn-primary text-black':'btn-ghost'} ${!roles.includes(r)?'opacity-40 cursor-not-allowed':''}`}>
              {r==='CLIENT'?'Клиент':r==='EXECUTOR'?'Исполнитель':'Админ'}
            </button>
          ))}
        </div>
        <div className="text-xs text-white/60 mt-2">Контекст влияет на нижнюю навигацию и страницы по умолчанию.</div>
      </motion.div>

      <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="card">
        <div className="text-lg font-semibold mb-3">Быстрые действия</div>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/client" onClick={()=>{ setWorkspace('CLIENT'); setMode('taxi'); }}>
            <button className="btn btn-primary w-full text-center">Оформить такси</button>
          </Link>
          <Link href="/client" onClick={()=>{ setWorkspace('CLIENT'); setMode('delivery'); }}>
            <button className="btn btn-primary w-full text-center">Оформить доставку</button>
          </Link>
          <Link href="/executor" onClick={()=>setWorkspace('EXECUTOR')}>
            <button className="btn btn-ghost w-full text-center">Лента исполнителя</button>
          </Link>
          <Link href="/admin" onClick={()=>setWorkspace('ADMIN')}>
            <button className="btn btn-ghost w-full text-center">Админ-панель</button>
          </Link>
        </div>
      </motion.div>

      <BottomNav />
    </div>
  );
}

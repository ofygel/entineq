'use client';
import Link from 'next/link';
import { useUI } from '@/lib/store';
import { motion } from 'framer-motion';

export default function Home() {
  const { setWorkspace, setMode } = useUI();
  const choose = (m: 'taxi'|'delivery') => { setWorkspace('CLIENT'); setMode(m); };
  const exec = () => setWorkspace('EXECUTOR');

  return (
    <div className="page items-center justify-between">
      <div className="w-full" />
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="card">
          <h1 className="text-2xl font-semibold text-center mb-4">Выберите услугу</h1>
          <div className="space-y-3">
            <Link href="/client" onClick={()=>choose('taxi')} className="block">
              <button className="btn btn-primary w-full text-lg py-4">Женское такси</button>
            </Link>
            <Link href="/client" onClick={()=>choose('delivery')} className="block">
              <button className="btn btn-primary w-full text-lg py-4">Доставка</button>
            </Link>
          </div>
        </div>
      </motion.div>
      <div className="w-full mt-6">
        <Link href="/executor" onClick={exec} className="block">
          <button className="btn btn-ghost w-full text-sm text-white/90 border border-white/20">Исполнитель</button>
        </Link>
      </div>
    </div>
  );
}

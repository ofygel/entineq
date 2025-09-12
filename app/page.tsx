'use client';
import Link from 'next/link';
import { useUI } from '@/lib/store';
import { motion } from 'framer-motion';


export default function Home() {
const { setRole, setMode } = useUI();
const gotoClient = (mode: 'taxi' | 'delivery') => { setRole('CLIENT'); setMode(mode); };
return (
<div className="flex-1 flex flex-col items-center justify-between max-w-md mx-auto py-8 px-4">
<div className="w-full" />
<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="w-full">
<div className="glass rounded-2xl p-5 bg-white text-black">
<h1 className="text-2xl font-semibold text-center mb-4">Выберите услугу</h1>
<div className="space-y-3">
<Link href="/client" onClick={() => gotoClient('taxi')} className="block">
<button className="btn btn-primary w-full text-lg py-4 rounded-2xl">Женское такси</button>
</Link>
<Link href="/client" onClick={() => gotoClient('delivery')} className="block">
<button className="btn btn-primary w-full text-lg py-4 rounded-2xl">Доставка</button>
</Link>
</div>
</div>
</motion.div>
<div className="w-full mt-6">
<Link href="/executor" onClick={() => { setRole('EXECUTOR'); }} className="block">
<button className="btn btn-ghost w-full text-sm text-white/80 border border-white/20">Исполнитель</button>
</Link>
</div>
</div>
);
}

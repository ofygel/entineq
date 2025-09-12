'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData, useUI } from '@/lib/store';


export default function OrderFlowDelivery() {
const { createOrder } = useData();
const { openModal } = useUI();
const [from, setFrom] = useState('');
const [to, setTo] = useState('');
const [size, setSize] = useState<'S'|'M'|'L'>('S');
const [comment, setComment] = useState('');
const price = size === 'S' ? 1200 : size === 'M' ? 1600 : 2200;
const submit = () => { const order = createOrder({ type: 'DELIVERY', from, to, packageSize: size, comment, priceEstimate: price }); openModal(`order-created-${order.id}`); };
return (
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto p-4 space-y-4">
<div className="glass rounded-2xl p-4">
<h2 className="text-xl font-semibold mb-3">Доставка</h2>
<div className="space-y-3">
<input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Забрать (2ГИС/адрес)" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none" />
<input value={to} onChange={e=>setTo(e.target.value)} placeholder="Доставить (2ГИС/адрес)" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none" />
<div className="flex items-center gap-2">
{(['S','M','L'] as const).map(s => (
<button key={s} onClick={()=>setSize(s)} className={`btn ${size===s?'btn-primary text-black':'btn-ghost'} flex-1`}>Посылка {s}</button>
))}
</div>
<textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Комментарий" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none resize-none h-20" />
<div className="flex items-center justify-between">
<div className="text-white/80">Предварительно: <b className="text-white">{price.toLocaleString()}₸</b></div>
<button disabled={!from || !to} onClick={submit} className="btn btn-secondary rounded-2xl disabled:opacity-50">Опубликовать заказ</button>
</div>
</div>
</div>
</motion.div>
);
}

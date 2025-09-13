'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useData, useUI } from '@/lib/store';
import AddressInput from '@/components/AddressInput';

export default function OrderFlowDelivery() {
  const { createOrder } = useData();
  const { openModal } = useUI();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [size, setSize] = useState<'S'|'M'|'L'>('S');
  const [comment, setComment] = useState('');

  const base  = size==='L'?2200:size==='M'?1600:1200;
  const price = useMemo(()=> base, [base]);

  const submit = () => {
    const order = createOrder({ type:'DELIVERY', from, to, packageSize:size, comment, priceEstimate: price });
    openModal(`order-created-${order.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="container-mobile pt-safe pb-safe">
      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">Доставка</h2>

        <AddressInput label="Забрать" value={from} onChange={setFrom}
          onPickCoords={(c,label)=> setFrom(label ?? `${c.lat}, ${c.lon}`)} />
        <AddressInput label="Доставить" value={to} onChange={setTo}
          onPickCoords={(c,label)=> setTo(label ?? `${c.lat}, ${c.lon}`)} />

        <div className="flex items-center gap-2">
          {(['S','M','L'] as const).map(s => (
            <button key={s} onClick={()=>setSize(s)} className={`btn ${size===s?'btn-primary text-black':'btn-ghost'} flex-1`}>Посылка {s}</button>
          ))}
        </div>

        <div className="label">Комментарий</div>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} className="textarea h-20" placeholder="Напр.: «Хрупкое»" />

        <div className="glass rounded-2xl p-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Предварительно</span>
            <span className="font-medium">{price.toLocaleString()}₸</span>
          </div>
        </div>

        <button className="btn btn-secondary w-full disabled:opacity-50" disabled={!from||!to} onClick={submit}>Опубликовать заказ</button>
      </div>
    </motion.div>
  );
}

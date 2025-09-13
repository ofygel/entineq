'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData, useUI } from '@/lib/store';
import GeoAssist from '@/components/GeoAssist';

export default function OrderFlowDelivery() {
  const { createOrder } = useData();
  const { openModal } = useUI();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [size, setSize] = useState<'S'|'M'|'L'>('S');
  const [comment, setComment] = useState('');
  const price = size === 'S' ? 1200 : size === 'M' ? 1600 : 2200;

  const submit = () => {
    const order = createOrder({ type: 'DELIVERY', from, to, packageSize: size, comment, priceEstimate: price });
    openModal(`order-created-${order.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Доставка</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-white/70">Забрать</label>
            <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Адрес или ссылка 2ГИС" className="input" />
          </div>
          <div>
            <label className="text-sm text-white/70">Доставить</label>
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Адрес или ссылка 2ГИС" className="input" />
          </div>

          <GeoAssist
            target="to"
            onExtract={(v)=>{ if (v.from) setFrom(`${v.from.lat}, ${v.from.lon}`); if (v.to) setTo(`${v.to.lat}, ${v.to.lon}`); }}
            showReverseAddress={false}
          />

          <div className="flex items-center gap-2">
            {(['S','M','L'] as const).map(s => (
              <button key={s} onClick={()=>setSize(s)} className={`btn ${size===s?'btn-primary text-black':'btn-ghost'} flex-1`}>Посылка {s}</button>
            ))}
          </div>
          <div>
            <label className="text-sm text-white/70">Комментарий</label>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} className="textarea h-20" placeholder="Например: «Хрупкое, не трясти»" />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-white/80">Предварительно: <b className="text-white">{price.toLocaleString()}₸</b></div>
            <button disabled={!from || !to} onClick={submit} className="btn btn-secondary rounded-2xl disabled:opacity-50">Опубликовать заказ</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

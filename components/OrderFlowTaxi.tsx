'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useData, useUI } from '@/lib/store';
import GeoAssist from '@/components/GeoAssist';

export default function OrderFlowTaxi() {
  const { createOrder } = useData();
  const { openModal } = useUI();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [distanceKm, setDistanceKm] = useState(5);
  const [comment, setComment] = useState('');
  const price = Math.max(800, Math.round(500 + distanceKm * 180));

  const submit = () => {
    const order = createOrder({ type: 'TAXI', from, to, distanceKm, comment, priceEstimate: price });
    openModal(\`order-created-\${order.id}\`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto p-4 space-y-4">
      <div className="glass rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-3">Женское такси</h2>
        <div className="space-y-3">
          <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Откуда (адрес/2ГИС ссылка)" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none" />
          <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Куда (адрес/2ГИС ссылка)" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none" />

          <GeoAssist
            cityHint={undefined}
            target="to"
            onExtract={(v)=>{ if (v.from) setFrom(`${v.from.lat},${v.from.lon}`); if (v.to) setTo(`${v.to.lat},${v.to.lon}`); }}
            showReverseAddress={false}
          />

          <div>
            <label className="text-sm text-white/70">Расстояние (км): {distanceKm}</label>
            <input type="range" min={1} max={30} value={distanceKm} onChange={e=>setDistanceKm(parseInt(e.target.value))} className="w-full" />
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

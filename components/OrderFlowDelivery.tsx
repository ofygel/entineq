'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useData, useUI } from '@/lib/store';
import GeoAssist from '@/components/GeoAssist';
import { coordsFromAny, haversineKm, round1 } from '@/lib/geo';

export default function OrderFlowDelivery() {
  const { createOrder } = useData();
  const { openModal } = useUI();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [size, setSize] = useState<'S'|'M'|'L'>('S');
  const [comment, setComment] = useState('');

  const cFrom = useMemo(()=> coordsFromAny(from), [from]);
  const cTo   = useMemo(()=> coordsFromAny(to),   [to]);
  const distanceKm = useMemo(()=> (cFrom && cTo) ? round1(haversineKm(cFrom, cTo)) : null, [cFrom, cTo]);

  const base = size === 'S' ? 1200 : size === 'M' ? 1600 : 2200;
  const price = distanceKm ? Math.round(base + Math.max(0, distanceKm-3) * 80) : base;

  const submit = () => {
    const order = createOrder({ type: 'DELIVERY', from, to, packageSize: size, comment, priceEstimate: price, distanceKm: distanceKm ?? undefined } as any);
    openModal(`order-created-${order.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="page">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Доставка</h2>
        <div className="space-y-3">
          <div>
            <label className="label">Забрать</label>
            <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Адрес, 2ГИС-ссылка или координаты" className="input" />
          </div>
          <div>
            <label className="label">Доставить</label>
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Адрес, 2ГИС-ссылка или координаты" className="input" />
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
            <label className="label">Комментарий</label>
            <textarea value={comment} onChange={e=>setComment(e.target.value)} className="textarea h-20" placeholder="Напр.: «Хрупкое, не трясти»" />
          </div>

          <div className="glass rounded-2xl p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Оценка дистанции</span>
              <span className="font-medium">{distanceKm ? `${distanceKm} км` : '—'}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="text-white/80">Предварительно: <b className="text-white text-lg">{price.toLocaleString()}₸</b></div>
            <button disabled={!cFrom || !cTo} onClick={submit} className="btn btn-secondary w-full disabled:opacity-50">Опубликовать заказ</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

'use client';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useData, useUI } from '@/lib/store';
import { coordsFromAny, haversineKm, round1 } from '@/lib/geo';
import GeoAssist from '@/components/GeoAssist';

type Coords = { lat:number; lon:number } | null;

export default function OrderFlowTaxi() {
  const { createOrder } = useData();
  const { openModal } = useUI();

  const [from, setFrom] = useState('');   // что ввёл пользователь
  const [to, setTo]     = useState('');
  const cFrom: Coords = useMemo(()=> coordsFromAny(from), [from]);
  const cTo:   Coords = useMemo(()=> coordsFromAny(to),   [to]);

  const distanceKm = useMemo(()=> (cFrom && cTo) ? round1(haversineKm(cFrom, cTo)) : null, [cFrom, cTo]);

  // тариф: посадка 700 + 120 тг/км (на прямой). Можно заменить на реальный позже.
  const price = useMemo(()=> {
    if (!distanceKm) return 700;
    return Math.max(700, Math.round(700 + distanceKm * 120));
  }, [distanceKm]);

  const submit = () => {
    const order = createOrder({
      type: 'TAXI',
      from, to,
      distanceKm: distanceKm ?? undefined,
      priceEstimate: price,
      comment: undefined,
    } as any);
    openModal(`order-created-${order.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="page">
      <div className="card">
        <h2 className="text-xl font-semibold mb-3">Женское такси</h2>
        <div className="space-y-3">
          <div>
            <label className="label">Откуда</label>
            <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Адрес, 2ГИС-ссылка или координаты" className="input" />
          </div>
          <div>
            <label className="label">Куда</label>
            <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Адрес, 2ГИС-ссылка или координаты" className="input" />
          </div>

          <GeoAssist
            target="to"
            onExtract={(v)=>{ if (v.from) setFrom(`${v.from.lat}, ${v.from.lon}`); if (v.to) setTo(`${v.to.lat}, ${v.to.lon}`); }}
            showReverseAddress={false}
          />

          <div className="glass rounded-2xl p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Расстояние</span>
              <span className="font-medium">{distanceKm ? `${distanceKm} км` : '—'}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="text-white/80">Предварительно: <b className="text-white text-lg">{price.toLocaleString()}₸</b></div>
            <button
              disabled={!cFrom || !cTo}
              onClick={submit}
              className="btn btn-secondary w-full disabled:opacity-50">
              Опубликовать заказ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

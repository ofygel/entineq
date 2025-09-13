'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useData, useUI } from '@/lib/store';
import AddressInput from '@/components/AddressInput';

export default function OrderFlowTaxi() {
  const { createOrder } = useData();
  const { openModal } = useUI();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [dist, setDist] = useState<number|null>(null);

  const price = useMemo(()=> dist ? Math.max(700, Math.round(700 + dist*120)) : 700, [dist]);

  const submit = () => {
    const order = createOrder({ type:'TAXI', from, to, priceEstimate: price });
    openModal(`order-created-${order.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="container-mobile pt-safe pb-safe">
      <div className="card space-y-3">
        <h2 className="text-xl font-semibold">Женское такси</h2>

        <AddressInput label="Откуда" value={from} onChange={setFrom}
          onPickCoords={(c,label)=> { setFrom(label ?? `${c.lat}, ${c.lon}`); }} />
        <AddressInput label="Куда" value={to} onChange={setTo}
          onPickCoords={(c,label)=> { setTo(label ?? `${c.lat}, ${c.lon}`); }} />

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

'use client';
import { useEffect, useState } from 'react';
import { useOrder } from '@/lib/order-store';

interface SavedOrder {
  id: number;
  type: string;
  fromText: string;
  toText: string;
  price?: number;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const { setStep } = useOrder();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(saved);
  }, []);

  if (!orders.length) {
    return (
      <div className="space-y-4">
        <div className="text-center">История пуста</div>
        <button className="btn" onClick={() => setStep('start')}>Новый заказ</button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">История заказов</h3>
      <ul className="space-y-1 max-h-60 overflow-y-auto pr-2">
        {orders.map((o) => (
          <li key={o.id} className="glass rounded-lg p-2 text-sm">
            <div className="font-medium">#{o.id} — {o.type}</div>
            <div className="text-white/80">{o.fromText} → {o.toText}</div>
            {o.price && <div className="text-white/60">~{o.price}₸</div>}
          </li>
        ))}
      </ul>
      <button className="btn" onClick={() => setStep('start')}>Назад</button>
    </div>
  );
}

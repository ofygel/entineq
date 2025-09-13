'use client';
import { useOrder } from '@/lib/order-store';

export default function FinishCard() {
  const { reset, draft } = useOrder();
  return (
    <div className="text-center space-y-4">
      <div className="text-lg">Заказ завершён</div>
      {draft.price && <div className="text-2xl font-semibold">{draft.price} ₸</div>}
      <button className="btn btn-primary w-full" onClick={reset}>Заказать ещё</button>
    </div>
  );
}

'use client';
import { useOrder } from '@/lib/order-store';

export default function PriceBadge() {
  const price = useOrder((s) => s.draft.price);
  if (!price) return null;
  return (
    <div className="absolute left-4 bottom-4 glass px-3 py-1 rounded-xl text-sm">
      ≈ {price} ₸
    </div>
  );
}

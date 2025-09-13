'use client';
import { useOrder } from '@/lib/order-store';

export default function OrderSummaryCard() {
  const { draft } = useOrder();
  return (
    <div className="space-y-2">
      <div><strong>Откуда:</strong> {draft.fromText}</div>
      <div><strong>Куда:</strong> {draft.toText}</div>
      <div><strong>Тип:</strong> {draft.type === 'TAXI' ? 'Женское такси' : 'Доставка'}</div>
      {draft.type === 'DELIVERY' && (
        <div><strong>Квартира/Этаж:</strong> {draft.apt} / {draft.floor}</div>
      )}
      {draft.comment && <div><strong>Комментарий:</strong> {draft.comment}</div>}
      {draft.price && <div><strong>Цена:</strong> {draft.price} ₸</div>}
    </div>
  );
}

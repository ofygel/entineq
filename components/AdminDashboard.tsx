'use client';
import { useState } from 'react';
import { useData } from '@/lib/store';


export default function AdminDashboard(){
const { verifications, reviewVerification, orders, closeOrder } = useData();
const [tab, setTab] = useState<'verif'|'orders'>('verif');
return (
<div className="max-w-md mx-auto w-full p-4 pb-20 space-y-4">
<div className="flex gap-2">
<button onClick={()=>setTab('verif')} className={`btn ${tab==='verif'?'btn-primary text-black':'btn-ghost'} flex-1`}>Верификации</button>
<button onClick={()=>setTab('orders')} className={`btn ${tab==='orders'?'btn-primary text-black':'btn-ghost'} flex-1`}>Заказы</button>
</div>
{tab==='verif' && (
<div className="space-y-3">
{verifications.length===0 && <div className="glass rounded-2xl p-5">Нет заявок</div>}
{verifications.map(v => (
<div key={v.id} className="glass rounded-2xl p-5">
<div className="text-sm text-white/70">Поступила {new Date(v.createdAt).toLocaleString()}</div>
<div className="font-semibold">Пользователь: {v.userId}</div>
<div className="text-sm">Статус: {v.status==='PENDING'?'Ожидает':v.status==='APPROVED'?'Принята':'Отклонена'}</div>
<div className="flex gap-2 mt-3">
<button disabled={v.status!=='PENDING'} onClick={()=>reviewVerification(v.id, true)} className="btn btn-secondary">Принять</button>
<button disabled={v.status!=='PENDING'} onClick={()=>reviewVerification(v.id, false)} className="btn btn-ghost">Отклонить</button>
</div>
</div>
))}
</div>
)}
{tab==='orders' && (
<div className="space-y-3">
{orders.length===0 && <div className="glass rounded-2xl p-5">Заказов нет</div>}
{orders.map(o => (
<div key={o.id} className="glass rounded-2xl p-5">
<div className="flex items-center justify-between">
<div>
<div className="text-sm text-white/70">{o.type==='TAXI'?'Такси':'Доставка'} · {o.status}</div>
<div className="font-semibold">{o.from} → {o.to}</div>
<div className="text-white/80 text-sm">{o.priceEstimate.toLocaleString()}₸</div>
</div>
<div className="flex flex-col gap-2">
<button onClick={()=>closeOrder(o.id)} className="btn btn-ghost">Закрыть</button>
</div>
</div>
</div>
))}
</div>
)}
</div>
);
}

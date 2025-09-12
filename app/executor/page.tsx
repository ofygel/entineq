<div className="glass rounded-2xl p-5 space-y-2">
<div className="text-white/80">Имя</div>
<div className="text-lg font-semibold">{me.name}</div>
<div className="flex items-center gap-2 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${me.verified?'bg-green-400':'bg-yellow-400'}`} /> {me.verified? 'Верифицирован' : 'Ожидает/не верифицирован'}</div>
<div className="flex items-center gap-2 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${me.subscriptionActive?'bg-green-400':'bg-red-400'}`} /> {me.subscriptionActive? 'Подписка активна' : 'Подписка неактивна'}</div>
</div>
)}


{tab==='verify' && me && (
<div className="glass rounded-2xl p-5 space-y-3">
<div className="text-white/85 font-semibold">Верификация</div>
<p className="text-sm text-white/70">Загрузите фото документов (демо: создаём заглушки)</p>
<button onClick={()=> submitVerification(me.id, ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB'])} className="btn btn-secondary rounded-xl">Отправить на модерацию</button>
</div>
)}


{tab==='subscription' && me && (
<div className="glass rounded-2xl p-5 space-y-3">
<div className="text-white/85 font-semibold">Подписка для исполнителя</div>
<p className="text-sm text-white/70">Демо‑переключатель имитирует оплату.</p>
<button onClick={()=> toggleSubscription(me.id, !me.subscriptionActive)} className="btn btn-primary rounded-xl">
{me.subscriptionActive ? 'Отключить подписку' : 'Оплатить и активировать'}
</button>
</div>
)}


<BottomNav />
</div>
);
}

export async function apiCreateOrder(payload: any){
  const r = await fetch('/api/orders', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
  const j = await r.json(); if (!r.ok) throw new Error(j.error||'create failed'); return j.order;
}
export async function apiFeed(city?: string){
  const r = await fetch('/api/orders' + (city?`?city=${encodeURIComponent(city)}`:'')); const j = await r.json(); if (!r.ok) throw new Error(j.error||'feed failed'); return j.orders as any[];
}
export async function apiClaim(orderId: string){
  const r = await fetch(`/api/orders/${orderId}/claim`, { method:'POST' }); const j = await r.json(); if (!r.ok) throw new Error(j.error||'claim failed'); return j.order;
}
export async function apiClose(orderId: string){
  const r = await fetch(`/api/orders/${orderId}/close`, { method:'POST' }); const j = await r.json(); if (!r.ok) throw new Error(j.error||'close failed'); return j.order;
}

executors: [
{ id: 'exec-1', name: 'Алина', vehicleType: 'CAR', verified: false, subscriptionActive: false },
{ id: 'exec-2', name: 'Мария', vehicleType: 'BIKE', verified: true, subscriptionActive: true },
],
meExecutorId: 'exec-1',
}),


createOrder: (payload) => {
const order: Order = { id: nanoid(8), status: 'NEW', createdAt: Date.now(), ...payload } as any;
set((s) => ({ orders: [order, ...s.orders] }));
if (typeof window !== 'undefined') localStorage.setItem('demo-data', JSON.stringify(get()));
return order;
},
claimOrder: (orderId, executorId) => {
set((s) => ({ orders: s.orders.map(o => o.id === orderId && o.status === 'NEW' ? { ...o, status: 'CLAIMED', claimedBy: executorId } : o) }));
if (typeof window !== 'undefined') localStorage.setItem('demo-data', JSON.stringify(get()));
},
closeOrder: (orderId) => {
set((s) => ({ orders: s.orders.map(o => o.id === orderId ? { ...o, status: 'CLOSED' } : o) }));
if (typeof window !== 'undefined') localStorage.setItem('demo-data', JSON.stringify(get()));
},
submitVerification: (userId, photos) => {
const v: Verification = { id: nanoid(8), userId, photos, status: 'PENDING', createdAt: Date.now() };
set((s) => ({ verifications: [v, ...s.verifications] }));
if (typeof window !== 'undefined') localStorage.setItem('demo-data', JSON.stringify(get()));
},
reviewVerification: (verifId, approve) => {
set((s) => ({
verifications: s.verifications.map(v => v.id === verifId ? { ...v, status: approve ? 'APPROVED' : 'REJECTED' } : v),
executors: s.executors.map(e => {
const v = s.verifications.find(v => v.id === verifId);
if (v && e.id === v.userId) return { ...e, verified: approve };
return e;
})
}));
if (typeof window !== 'undefined') localStorage.setItem('demo-data', JSON.stringify(get()));
},
toggleSubscription: (executorId, value) => {
set((s) => ({ executors: s.executors.map(e => e.id === executorId ? { ...e, subscriptionActive: value } : e) }));
if (typeof window !== 'undefined') localStorage.setItem('demo-data', JSON.stringify(get()));
},
}));

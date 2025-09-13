'use client';
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Role, Order, Verification, ExecutorProfile } from './types';

interface UIState {
  // Набор ролей у пользователя (может быть несколько)
  roles: Role[];
  // Текущий контекст приложения (строго одна роль)
  workspace: Role | null;

  // (для клиента) выбранная услуга
  mode: 'taxi' | 'delivery' | null;

  modal: string | null;

  setWorkspace: (r: Role | null) => void;
  addRole: (r: Role) => void;
  removeRole: (r: Role) => void;
  setMode: (m: UIState['mode']) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

interface DataState {
  orders: Order[];
  verifications: Verification[];
  executors: ExecutorProfile[];
  meExecutorId?: string;

  createOrder: (payload: Omit<Order, 'id'|'status'|'createdAt'>) => Order;
  claimOrder: (orderId: string, executorId: string) => void;
  closeOrder: (orderId: string) => void;

  submitVerification: (userId: string, photos: string[]) => void;
  reviewVerification: (verifId: string, approve: boolean) => void;
  toggleSubscription: (executorId: string, value: boolean) => void;
}

const persisted = <T extends object>(key: string, initial: T): T => {
  if (typeof window === 'undefined') return initial;
  try { const raw = localStorage.getItem(key); return raw ? { ...initial, ...JSON.parse(raw) } : initial; } catch { return initial; }
};
const save = (get: any) => { if (typeof window !== 'undefined') localStorage.setItem('demo-data', JSON.stringify(get())); };

export const useUI = create<UIState>((set, get) => ({
  ...persisted('demo-data', {
    roles: ['CLIENT'] as Role[],
    workspace: null as Role | null,
    mode: null as UIState['mode'],
    modal: null as string | null,
  }),

  setWorkspace: (r) => { set({ workspace: r }); save(get); },
  addRole: (r) => { const s = get(); if (!s.roles.includes(r)) { set({ roles: [...s.roles, r] }); save(get); } },
  removeRole: (r) => { const s = get(); set({ roles: s.roles.filter(x=>x!==r), workspace: s.workspace===r ? null : s.workspace }); save(get); },

  setMode: (m) => set({ mode: m }),
  openModal: (id) => set({ modal: id }),
  closeModal: () => set({ modal: null }),
}));

export const useData = create<DataState>((set, get) => ({
  ...persisted('demo-data', {
    orders: [] as Order[],
    verifications: [] as Verification[],
    executors: [
      { id: 'exec-1', name: 'Алина', vehicleType: 'CAR', verified: false, subscriptionActive: false },
      { id: 'exec-2', name: 'Мария', vehicleType: 'BIKE', verified: true, subscriptionActive: true },
    ] as ExecutorProfile[],
    meExecutorId: 'exec-1' as string | undefined,
  }),

  createOrder: (payload) => {
    const order: Order = { id: nanoid(8), status: 'NEW', createdAt: Date.now(), ...payload } as any;
    set((s) => ({ orders: [order, ...s.orders] })); save(get); return order;
  },
  claimOrder: (orderId, executorId) => {
    set((s) => ({ orders: s.orders.map(o => (o.id===orderId && o.status==='NEW') ? { ...o, status:'CLAIMED', claimedBy: executorId } : o) }));
    save(get);
  },
  closeOrder: (orderId) => { set((s)=>({ orders: s.orders.map(o => o.id===orderId ? { ...o, status:'CLOSED' } : o) })); save(get); },

  submitVerification: (userId, photos) => {
    const v: Verification = { id: nanoid(8), userId, photos, status:'PENDING', createdAt: Date.now() };
    set((s)=>({ verifications: [v, ...s.verifications] })); save(get);
  },
  reviewVerification: (verifId, approve) => {
    set((s)=>({
      verifications: s.verifications.map(v => v.id===verifId ? { ...v, status: approve?'APPROVED':'REJECTED' } : v),
      executors: s.executors.map(e => {
        const v = s.verifications.find(v=>v.id===verifId);
        return v && e.id===v.userId ? { ...e, verified: approve } : e;
      })
    })); save(get);
  },
  toggleSubscription: (executorId, value) => {
    set((s)=>({ executors: s.executors.map(e => e.id===executorId ? { ...e, subscriptionActive:value } : e) })); save(get);
  },
}));

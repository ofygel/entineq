'use client';
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Role, Order, Verification, ExecutorProfile } from './types';

interface UIState {
  role: Role | null;
  mode: 'taxi' | 'delivery' | null;
  modal: string | null;
  setRole: (r: Role | null) => void;
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

const persistWrite = (key: string, state: unknown) => {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }
};
const persistRead = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } as T : fallback;
  } catch {
    return fallback;
  }
};

export const useUI = create<UIState>((set) => ({
  role: null, mode: null, modal: null,
  setRole: (r) => set({ role: r }),
  setMode: (m) => set({ mode: m }),
  openModal: (id) => set({ modal: id }),
  closeModal: () => set({ modal: null }),
}));

export const useData = create<DataState>((set, get) => ({
  ...persistRead('demo-data', {
    orders: [] as Order[],
    verifications: [] as Verification[],
    executors: [
      { id: 'exec-1', name: 'Алина', vehicleType: 'CAR', verified: false, subscriptionActive: false },
      { id: 'exec-2', name: 'Мария', vehicleType: 'BIKE', verified: true, subscriptionActive: true },
    ] as ExecutorProfile[],
    meExecutorId: 'exec-1' as string,
  }),

  createOrder: (payload) => {
    const order: Order = { id: nanoid(8), status: 'NEW', createdAt: Date.now(), ...payload };
    set((s) => ({ orders: [order, ...s.orders] }));
    persistWrite('demo-data', get());
    return order;
  },

  claimOrder: (orderId, executorId) => {
    set((s) => ({ orders: s.orders.map(o => (o.id === orderId && o.status === 'NEW') ? { ...o, status: 'CLAIMED', claimedBy: executorId } : o) }));
    persistWrite('demo-data', get());
  },

  closeOrder: (orderId) => {
    set((s) => ({ orders: s.orders.map(o => o.id === orderId ? { ...o, status: 'CLOSED' } : o) }));
    persistWrite('demo-data', get());
  },

  submitVerification: (userId, photos) => {
    const v: Verification = { id: nanoid(8), userId, photos, status: 'PENDING', createdAt: Date.now() };
    set((s) => ({ verifications: [v, ...s.verifications] }));
    persistWrite('demo-data', get());
  },

  reviewVerification: (verifId, approve) => {
    set((s) => ({
      verifications: s.verifications.map(v => v.id === verifId ? { ...v, status: (approve ? 'APPROVED' : 'REJECTED') } : v),
      executors: s.executors.map(e => {
        const pending = s.verifications.find(v => v.id === verifId);
        return (pending && e.id === pending.userId) ? { ...e, verified: approve } : e;
      })
    }));
    persistWrite('demo-data', get());
  },

  toggleSubscription: (executorId, value) => {
    set((s) => ({ executors: s.executors.map(e => e.id === executorId ? { ...e, subscriptionActive: value } : e) }));
    persistWrite('demo-data', get());
  },
}));

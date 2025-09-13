'use client';
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Role, Order, Verification, ExecutorProfile, OrderStatus } from './types';

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

  createOrder: (payload: Omit<Order, 'id' | 'status' | 'createdAt'>) => Order;
  claimOrder: (orderId: string, executorId: string) => void;
  closeOrder: (orderId: string) => void;
  submitVerification: (userId: string, photos: string[]) => void;
  reviewVerification: (verifId: string, approve: boolean) => void;
  toggleSubscription: (executorId: string, value: boolean) => void;
}

/* ---------- persistence helpers ---------- */
const saveState = (key: string, state: unknown) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
};

const loadState = <T extends object>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) }) as T : fallback;
  } catch { return fallback; }
};

/* ---------- UI store ---------- */
export const useUI = create<UIState>((set) => ({
  role: null,
  mode: null,
  modal: null,
  setRole: (r) => set({ role: r }),
  setMode: (m) => set({ mode: m }),
  openModal: (id) => set({ modal: id }),
  closeModal: () => set({ modal: null }),
}));

/* ---------- Data store (демо до полноценного бэка) ---------- */
export const useData = create<DataState>((set, get) => ({
  ...loadState('demo-data', {
    orders: [] as Order[],
    verifications: [] as Verification[],
    executors: [
      { id: 'exec-1', name: 'Алина', vehicleType: 'CAR', verified: false, subscriptionActive: false },
      { id: 'exec-2', name: 'Мария', vehicleType: 'BIKE', verified: true, subscriptionActive: true },
    ] as ExecutorProfile[],
    meExecutorId: 'exec-1' as string | undefined,
  }),

  createOrder: (payload) => {
    const statusNew: OrderStatus = 'NEW';
    const order: Order = {
      id: nanoid(8),
      status: statusNew,
      createdAt: Date.now(),
      ...payload,
    };
    set((s) => ({ orders: [order, ...s.orders] }));
    saveState('demo-data', get());
    return order;
  },

  claimOrder: (orderId, executorId) => {
    const statusClaimed: OrderStatus = 'CLAIMED';
    set((s) => ({
      orders: s.orders.map((o): Order =>
        o.id === orderId && o.status === 'NEW'
          ? { ...o, status: statusClaimed, claimedBy: executorId }
          : o
      ),
    }));
    saveState('demo-data', get());
  },

  closeOrder: (orderId) => {
    const statusClosed: OrderStatus = 'CLOSED';
    set((s) => ({
      orders: s.orders.map((o): Order =>
        o.id === orderId ? { ...o, status: statusClosed } : o
      ),
    }));
    saveState('demo-data', get());
  },

  submitVerification: (userId, photos) => {
    const pending: Verification['status'] = 'PENDING';
    const v: Verification = {
      id: nanoid(8),
      userId,
      photos,
      status: pending,
      createdAt: Date.now(),
    };
    set((s) => ({ verifications: [v, ...s.verifications] }));
    saveState('demo-data', get());
  },

  reviewVerification: (verifId, approve) => {
    const newStatus: Verification['status'] = approve ? 'APPROVED' : 'REJECTED';
    set((s) => {
      const updatedVerifs: Verification[] = s.verifications.map((v): Verification =>
        v.id === verifId ? { ...v, status: newStatus } : v
      );
      const linked = s.verifications.find(v => v.id === verifId);
      const updatedExecs: ExecutorProfile[] = linked
        ? s.executors.map(e => e.id === linked.userId ? { ...e, verified: approve } : e)
        : s.executors;
      return { verifications: updatedVerifs, executors: updatedExecs };
    });
    saveState('demo-data', get());
  },

  toggleSubscription: (executorId, value) => {
    set((s) => ({
      executors: s.executors.map(e =>
        e.id === executorId ? { ...e, subscriptionActive: value } : e
      ),
    }));
    saveState('demo-data', get());
  },
}));

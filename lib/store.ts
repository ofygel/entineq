'use client';
import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Role, Order, Verification, ExecutorProfile } from './types';
import { apiClaim, apiClose, apiCreateOrder, apiFeed } from './api';

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
  refreshFeed: (city?: string) => Promise<void>;
  createOrder: (payload: Partial<Order> & { type: 'TAXI'|'DELIVERY'; from: string; to: string; priceEstimate?: number; distanceKm?: number; comment?: string; packageSize?: 'S'|'M'|'L' }) => Promise<Order>;
  claimOrder: (orderId: string, executorId: string) => Promise<void>;
  closeOrder: (orderId: string) => Promise<void>;
  submitVerification: (userId: string, photos: string[]) => void;
  reviewVerification: (verifId: string, approve: boolean) => void;
  toggleSubscription: (executorId: string, value: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  role: null, mode: null, modal: null,
  setRole: (r) => set({ role: r }),
  setMode: (m) => set({ mode: m }),
  openModal: (id) => set({ modal: id }),
  closeModal: () => set({ modal: null }),
}));

export const useData = create<DataState>((set, get) => ({
  orders: [],
  verifications: [],
  executors: [
    { id: 'exec-1', name: 'Алина', vehicleType: 'CAR', verified: false, subscriptionActive: false },
    { id: 'exec-2', name: 'Мария', vehicleType: 'BIKE', verified: true, subscriptionActive: true },
  ],
  meExecutorId: 'exec-1',

  refreshFeed: async (city) => {
    const list = await apiFeed(city);
    // Приводим к клиентскому типу (часть полей другая в БД)
    const normalized: Order[] = list.map((o:any)=>({
      id: o.id,
      type: o.type,
      from: o.from_addr ?? '',
      to: o.to_addr ?? '',
      distanceKm: o.distance_km ?? undefined,
      comment: o.comment_text ?? undefined,
      priceEstimate: Number(o.price_estimate)||0,
      status: (o.status === 'COMPLETED') ? 'CLOSED' : (o.status as any),
      claimedBy: o.claimed_by ?? undefined,
      createdAt: new Date(o.created_at).getTime(),
    }));
    set({ orders: normalized });
  },

  createOrder: async (payload) => {
    const body:any = {
      type: payload.type,
      from_addr: payload.from,
      to_addr: payload.to,
      comment_text: payload.comment ?? null,
      distance_km: payload.distanceKm ?? null,
      price_estimate: payload.priceEstimate ?? null
    };
    const o = await apiCreateOrder(body);
    const order: Order = {
      id: o.id, type: o.type, from: o.from_addr, to: o.to_addr,
      distanceKm: o.distance_km ?? undefined,
      comment: o.comment_text ?? undefined,
      priceEstimate: Number(o.price_estimate)||0,
      status: (o.status === 'COMPLETED') ? 'CLOSED' : (o.status as any),
      createdAt: new Date(o.created_at).getTime()
    };
    set((s)=>({ orders: [order, ...s.orders] }));
    return order;
  },

  claimOrder: async (orderId) => {
    const o = await apiClaim(orderId);
    set((s)=>({ orders: s.orders.map(it => it.id===orderId ? { ...it, status: 'CLAIMED' } : it) }));
  },

  closeOrder: async (orderId) => {
    await apiClose(orderId);
    set((s)=>({ orders: s.orders.map(it => it.id===orderId ? { ...it, status: 'CLOSED' } : it) }));
  },

  // ниже — демо до подключения реального бекенда
  submitVerification: (userId, photos) => {
    const v: Verification = { id: nanoid(8), userId, photos, status: 'PENDING', createdAt: Date.now() };
    set((s) => ({ verifications: [v, ...s.verifications] }));
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
  },
  toggleSubscription: (executorId, value) => {
    set((s) => ({ executors: s.executors.map(e => e.id === executorId ? { ...e, subscriptionActive: value } : e) }));
  },
}));

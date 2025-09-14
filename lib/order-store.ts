import { create } from 'zustand';

export type FlowStep =
  | 'start'
  | 'details'
  | 'searching'
  | 'in_progress'
  | 'completed'
  | 'error'
  | 'history'
  | 'feedback'
  | 'support';

export interface OrderDraft {
  type: 'TAXI' | 'DELIVERY';
  fromText: string;
  toText: string;
  from: { lat: number; lon: number } | null;
  to: { lat: number; lon: number } | null;
  apt?: string;
  floor?: string;
  comment?: string;
  distanceKm?: number;
  etaMin?: number;
  price?: number;
}

interface UIFlowState {
  open: boolean;
  step: FlowStep;
  draft: OrderDraft;
  openModal: () => void;
  closeModal: () => void;
  setStep: (s: FlowStep) => void;
  patchDraft: (p: Partial<OrderDraft>) => void;
  reset: () => void;
}

const initialDraft: OrderDraft = {
  type: 'TAXI',
  fromText: '',
  toText: '',
  from: null,
  to: null,
};

export const useOrder = create<UIFlowState>((set) => ({
  open: false,
  step: 'start',
  draft: initialDraft,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
  setStep: (s) => set({ step: s }),
  patchDraft: (p) => set((state) => ({ draft: { ...state.draft, ...p } })),
  reset: () => set({ step: 'start', draft: initialDraft, open: false }),
}));

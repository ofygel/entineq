'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUI } from '@/lib/store';
import OrderFlowTaxi from '@/components/OrderFlowTaxi';
import OrderFlowDelivery from '@/components/OrderFlowDelivery';
import BottomNav from '@/components/BottomNav';

export default function ClientPage() {
  const { workspace, mode } = useUI();
  const router = useRouter();

  useEffect(()=>{ if (workspace && workspace!=='CLIENT') router.replace('/account'); }, [workspace]);
  if (!mode) { if (typeof window !== 'undefined') router.replace('/'); return null; }

  return (
    <div className="flex-1 flex flex-col container-mobile pt-safe pb-safe">
      {mode === 'taxi' ? <OrderFlowTaxi /> : <OrderFlowDelivery />}
      <BottomNav />
    </div>
  );
}

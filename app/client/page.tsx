'use client';
import { useRouter } from 'next/navigation';
import { useUI } from '@/lib/store';
import OrderFlowTaxi from '@/components/OrderFlowTaxi';
import OrderFlowDelivery from '@/components/OrderFlowDelivery';
import BottomNav from '@/components/BottomNav';

export default function ClientPage() {
  const { mode } = useUI();
  const router = useRouter();
  if (!mode) { if (typeof window !== 'undefined') router.replace('/'); return null; }
  return (
    <div className="page">
      {mode === 'taxi' ? <OrderFlowTaxi /> : <OrderFlowDelivery />}
      <BottomNav />
    </div>
  );
}

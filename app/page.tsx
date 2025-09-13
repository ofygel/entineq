'use client';
import OrderModal from '@/components/OrderModal';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  return (
    <div className="page">
      <OrderModal />
      <BottomNav />
    </div>
  );
}

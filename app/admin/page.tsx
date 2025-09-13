'use client';
import AdminDashboard from '@/components/AdminDashboard';
import BottomNav from '@/components/BottomNav';
export default function AdminPage(){
  return (
    <div className="page">
      <AdminDashboard/>
      <BottomNav />
    </div>
  );
}

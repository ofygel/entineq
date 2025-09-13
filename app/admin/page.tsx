'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/AdminDashboard';
import { useUI } from '@/lib/store';
import BottomNav from '@/components/BottomNav';

export default function AdminPage(){
  const { workspace } = useUI();
  const router = useRouter();
  useEffect(()=>{ if (workspace && workspace!=='ADMIN') router.replace('/account'); }, [workspace]);

  return (
    <div className="container-mobile pt-safe pb-safe">
      <AdminDashboard/>
      <BottomNav />
    </div>
  );
}

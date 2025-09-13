'use client';
import { useParams, useRouter } from 'next/navigation';
import ChatWindow from '@/components/Chat/ChatWindow';

export default function ChatByOrderPage(){
  const params = useParams<{ orderId: string }>();
  const router = useRouter();
  const orderId = params.orderId;
  if (!orderId) { if (typeof window!=='undefined') router.replace('/'); return null; }
  return (
    <div className="max-w-md mx-auto p-4">
      <ChatWindow orderId={orderId} />
    </div>
  );
}

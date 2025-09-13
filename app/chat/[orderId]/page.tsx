'use client';
import ChatWindow from '@/components/Chat/ChatWindow';
export default function ChatPage({ params }: { params: { orderId: string } }) {
  return (
    <div className="container-mobile pt-safe pb-safe space-y-3">
      <h1 className="text-xl font-semibold">Чат заказа</h1>
      <ChatWindow orderId={params.orderId}/>
    </div>
  );
}

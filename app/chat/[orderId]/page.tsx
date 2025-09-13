import ChatWindow from '@/components/Chat/ChatWindow';

export default async function ChatPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <div className="container-mobile pt-safe pb-safe space-y-3">
      <h1 className="text-xl font-semibold">Чат заказа</h1>
      <ChatWindow orderId={orderId} />
    </div>
  );
}

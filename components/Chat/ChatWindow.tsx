'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useData, useUI } from '@/lib/store';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ orderId }: { orderId: string }) {
  const { role } = useUI();
  const { chats, messages, openChatByOrder, sendMessage, orders } = useData();
  const [text, setText] = useState('');
  const chat = useMemo(()=> openChatByOrder(orderId), [orderId, chats.length, orders.length]);
  const feed = useMemo(()=> messages.filter(m=>m.chatId===chat?.id).sort((a,b)=>a.createdAt-b.createdAt), [messages, chat?.id]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [feed.length]);

  const onSend = () => {
    const body = text.trim();
    if (!body || !chat || !role) return;
    const sender = role === 'EXECUTOR' ? 'EXECUTOR' : 'CLIENT';
    sendMessage(orderId, sender, body);
    setText('');
  };

  return (
    <div className="glass rounded-2xl p-3 h-[70vh] flex flex-col">
      <div className="text-sm text-white/70 mb-2">Чат по заказу {orderId}</div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {feed.map(m => (
          <MessageBubble key={m.id} mine={m.sender === (role==='EXECUTOR'?'EXECUTOR':'CLIENT')}
            text={m.body} time={new Date(m.createdAt).toLocaleTimeString()} />
        ))}
        <div ref={endRef} />
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e=>{ if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder="Сообщение"
          className="flex-1 rounded-xl px-3 py-2 bg-white/10 border border-white/20 outline-none"
        />
        <button onClick={onSend} className="btn btn-primary rounded-xl">Отпр.</button>
      </div>
    </div>
  );
}

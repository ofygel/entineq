'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ChatWindow({ orderId }: { orderId: string }) {
  const [chatId, setChatId] = useState<string|undefined>();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ listRef.current?.scrollTo({ top: 999999 }); }, [messages]);

  useEffect(()=>{ (async()=>{
    const r = await fetch(`/api/chat/${orderId}`); const j = await r.json();
    if (r.ok) setChatId(j.chat.id); else alert(j.error||'chat error');
  })(); }, [orderId]);

  useEffect(()=> {
    if (!chatId) return;
    const sub = supabase
      .channel(`messages:${chatId}`)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`chat_id=eq.${chatId}` },
        (payload: any) => setMessages((prev)=> [...prev, payload.new]))
      .subscribe();
    (async()=>{
      const { data, error } = await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at',{ascending:true}).limit(200);
      if (!error && data) setMessages(data);
    })();
    return ()=> { supabase.removeChannel(sub); };
  }, [chatId]);

  const send = async ()=> {
    if (!input.trim()) return;
    const r = await fetch(`/api/chat/${orderId}/message`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ text: input.trim() }) });
    const j = await r.json(); if (!r.ok) return alert(j.error||'send failed'); setInput('');
  };

  return (
    <div className="flex flex-col h-[70svh] glass rounded-2xl">
      <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map(m => (
          <div key={m.id} className="max-w-[80%] rounded-2xl px-3 py-2 bg-white/10">{m.body}</div>
        ))}
      </div>
      <div className="p-2 flex gap-2">
        <input className="input flex-1" placeholder="Сообщение..." value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==='Enter' && send()} />
        <button className="btn btn-secondary" onClick={send}>Отпр.</button>
      </div>
    </div>
  );
}

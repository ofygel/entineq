'use client';
import { useEffect, useRef, useState } from 'react';
import type { OrderDraft } from '@/lib/order-store';

interface SuggestItem {
  name: string;
  full_name: string;
  point: { lat: number; lon: number };
}

export default function AddressInput({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: string;
  onSelect: (v: { text: string; point: { lat: number; lon: number } }) => void;
}) {
  const [q, setQ] = useState(value);
  const [list, setList] = useState<SuggestItem[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setQ(value); }, [value]);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!q || q.length < 3) { setList([]); return; }
      try {
        const res = await fetch(`/api/2gis/places?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data: SuggestItem[] = await res.json();
          setList(data);
          setOpen(true);
        }
      } catch {}
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <label className="block mb-1 text-sm text-white/80">{label}</label>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="input w-full"
        placeholder="Начните вводить адрес"
      />
      {open && list.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 glass rounded-2xl p-2 max-h-60 overflow-y-auto">
          {list.map((it, idx) => (
            <button
              key={idx}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10"
              onClick={() => {
                onSelect({ text: it.full_name || it.name, point: it.point });
                setOpen(false);
              }}
            >
              {it.full_name || it.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

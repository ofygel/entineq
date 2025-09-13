'use client';
import { useEffect, useRef, useState } from 'react';
import { dgisSuggest, open2GisApp, getMyLocation } from '@/lib/dgis';

export default function AddressInput({
  label, value, onChange, onPickCoords
}: { label: string; value: string; onChange: (v:string)=>void; onPickCoords: (coords:{lat:number;lon:number}, label?:string)=>void }) {
  const [q, setQ] = useState(value);
  const [list, setList] = useState<Array<{label:string; lat:number; lon:number}>>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{ setQ(value); }, [value]);

  useEffect(()=> {
    const t = setTimeout(async ()=>{
      if (!q || q.length < 3) return setList([]);
      const s = await dgisSuggest(q);
      setList(s); setOpen(true);
    }, 250);
    return ()=> clearTimeout(t);
  }, [q]);

  useEffect(()=> {
    const h = (e:MouseEvent)=> { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h); return ()=> document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div className="label">{label}</div>
      <input className="input" value={q} onChange={e=>{ setQ(e.target.value); onChange(e.target.value); }} placeholder="Адрес или ссылка 2ГИС" />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button className="btn btn-ghost" onClick={open2GisApp}>Открыть 2ГИС</button>
        <button className="btn btn-ghost" onClick={async()=>{
          const me = await getMyLocation();
          if (me) onPickCoords(me, 'Моё местоположение'); else alert('Не удалось получить геолокацию');
        }}>Моё местоположение</button>
      </div>
      {open && list.length>0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 glass rounded-2xl p-2 max-h-60 overflow-y-auto">
          {list.map((it,i)=> (
            <button key={i} className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10"
              onClick={()=>{ onPickCoords({ lat: it.lat, lon: it.lon }, it.label); setOpen(false); }}>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { getMyLocation } from '@/lib/dgis';
import { build2GisGeoLink } from '@/lib/geo';

export default function SOSBar(){
  const [busy, setBusy] = useState(false);

  const share = async ()=>{
    setBusy(true);
    const loc = await getMyLocation();
    setBusy(false);
    if (!loc) return alert('Не удалось получить геолокацию');
    const link = build2GisGeoLink({ lon: loc.lon, lat: loc.lat });
    if ((navigator as any).share) {
      try { await (navigator as any).share({ title:'Моё местоположение', text:'Поделиться точкой', url: link }); } catch {}
    } else {
      await navigator.clipboard.writeText(link);
      alert('Ссылка скопирована в буфер: ' + link);
    }
  };

  const call911 = ()=> location.href = 'tel:112';

  return (
    <div className="glass rounded-2xl p-3 flex gap-2">
      <button className="btn btn-secondary flex-1" onClick={share} disabled={busy}>Поделиться локацией</button>
      <button className="btn btn-ghost" onClick={call911}>SOS</button>
    </div>
  );
}

'use client';
import { useMemo, useState } from 'react';
import { parse2GisUrl, build2GisDirectionsLink, build2GisGeoLink, formatCoordsLabel } from '@/lib/geo';

type Target = 'auto'|'from'|'to';

export default function GeoAssist({
  target='auto',
  cityHint,
  onExtract,
  showReverseAddress=false,
}: {
  target?: Target;
  cityHint?: string;
  onExtract: (v: { from?: { lon:number;lat:number }, to?: { lon:number;lat:number }, label?: string, deepLink?: string }) => void;
  showReverseAddress?: boolean;
}) {
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  const isShort = useMemo(()=> /^https?:\/\/go\.2gis\.com\//i.test(input.trim()), [input]);

  const copy = async (t: string) => {
    try { await navigator.clipboard.writeText(t); alert('Ссылка скопирована'); } catch { alert('Не удалось скопировать'); }
  };

  const share = async (url: string) => {
    try {
      if (navigator.share) await navigator.share({ url, title: 'Адрес в 2ГИС' });
      else await copy(url);
    } catch {}
  };

  const expandIfNeeded = async (url: string) => {
    if (!/^https?:\/\//i.test(url)) return url;
    if (!/^https?:\/\/go\.2gis\.com\//i.test(url)) return url;
    const r = await fetch('/api/expand2gis', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ url }) });
    const j = await r.json(); if (!r.ok) throw new Error(j?.error || 'expand failed');
    return j.expanded as string;
  };

  const parse = async () => {
    try {
      const raw = input.trim();
      const url = await expandIfNeeded(raw);
      if (url !== raw) setExpanded(url);
      const p = parse2GisUrl(url);
      if (p.kind === 'unknown') return alert('Не удалось распознать ссылку 2ГИС');

      let from, to; let dl: string | undefined;

      if (p.kind === 'directions') {
        from = p.from && { lon:p.from.lon, lat:p.from.lat };
        to   = p.to   && { lon:p.to.lon,   lat:p.to.lat };
        if (!from && !to) return alert('Нет координат в ссылке');
        if (!from || !to) {
          const pt = (from || to)!;
          if (target==='from') from = pt; else to = pt;
          dl = build2GisGeoLink({ ...pt, city: cityHint });
        } else dl = build2GisDirectionsLink({ from, to, city: cityHint, mode: (p.routeType as any) || 'car' });
      }
      if (p.kind === 'geo') {
        const pt = { lon:p.point.lon, lat:p.point.lat };
        if (target==='from') from = pt; else to = pt;
        dl = build2GisGeoLink({ ...pt, city: cityHint });
      }

      setDeepLink(dl || null);
      onExtract({ from, to, label: formatCoordsLabel((to||from)!), deepLink: dl });

      if (showReverseAddress) {
        try {
          const r = await fetch(`/api/revgeo?lat=${(to||from)!.lat}&lon=${(to||from)!.lon}`);
          const j = await r.json(); if (r.ok && j?.label) setLabel(j.label);
        } catch {}
      } else setLabel(formatCoordsLabel((to||from)!));
    } catch (e: any) { alert(e?.message || 'Ошибка обработки ссылки'); }
  };

  return (
    <div className="glass rounded-2xl p-3 space-y-3">
      <div className="text-sm text-white/80">Вставьте ссылку из приложения 2ГИС (поддерживаются <code>2gis.kz</code>, <code>2gis.ru</code>, <code>go.2gis.com</code>).</div>
      <div className="flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Напр.: https://2gis.kz/almaty/geo/..." className="flex-1 rounded-xl px-3 py-2 bg-white/10 border border-white/20 outline-none" />
        <button onClick={parse} className="btn btn-secondary rounded-xl">Распознать</button>
      </div>
      {(expanded || deepLink || label) && (
        <div className="text-xs space-y-1 text-white/75">
          {expanded && <div>Развёрнуто: <span className="break-all">{expanded}</span></div>}
          {label && <div>Метка: {label}</div>}
          {deepLink && (
            <div className="flex gap-2 pt-1">
              <a className="btn btn-primary rounded-xl flex-1 text-center" target="_blank" href={deepLink}>Открыть в 2ГИС</a>
              <button className="btn btn-ghost rounded-xl" onClick={()=>share(deepLink)}>Поделиться</button>
              <button className="btn btn-ghost rounded-xl" onClick={()=>copy(deepLink)}>Копировать</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

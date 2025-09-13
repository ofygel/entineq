'use client';
import { useState } from 'react';
import { parse2GisUrl, build2GisDirectionsLink, build2GisGeoLink, formatCoordsLabel } from '@/lib/geo';

export default function GeoAssist({
  target='auto',
  cityHint,
  onExtract,
  showReverseAddress=false,
}: {
  target?: 'auto'|'from'|'to';
  cityHint?: string;
  onExtract: (v: { from?: { lon:number;lat:number }, to?: { lon:number;lat:number }, label?: string, deepLink?: string }) => void;
  showReverseAddress?: boolean;
}) {
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  const open2gis = () => {
    // Универсальная ссылка: если приложение установлено — откроется оно, иначе — сайт с предложением открыть приложение.
    const url = 'https://go.2gis.com';
    try { window.open(url, '_blank'); } catch { location.href = url; }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && /^https?:\/\//i.test(text)) {
        setInput(text);
        // Автопарс сразу после вставки
        setTimeout(parse, 0);
      } else if (text) {
        setInput(text);
      } else {
        alert('В буфере нет текста. Скопируйте ссылку в 2ГИС → вернитесь сюда и нажмите «Вставить из буфера».');
      }
    } catch {
      alert('Браузер не дал доступ к буферу обмена. Вставьте ссылку вручную (долгое нажатие → Вставить).');
    }
  };

  const copy = async (t: string) => { try { await navigator.clipboard.writeText(t); alert('Скопировано'); } catch {} };
  const share = async (url: string) => { try { if (navigator.share) await navigator.share({ url, title: 'Адрес в 2ГИС' }); else await copy(url); } catch {} };

  const expandIfNeeded = async (url: string) => {
    if (!/^https?:\/\//i.test(url)) return url;
    if (!/^https?:\/\/go\.2gis\.com\//i.test(url)) return url;
    const r = await fetch('/api/expand2gis', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ url }) });
    const j = await r.json(); if (!r.ok) throw new Error(j?.error || 'expand failed'); return j.expanded as string;
  };

  const parse = async () => {
    try {
      const raw = input.trim(); if (!raw) return;
      const url = await expandIfNeeded(raw); if (url !== raw) setExpanded(url);
      const p = parse2GisUrl(url);
      if (p.kind === 'unknown') return alert('Не удалось распознать ссылку 2ГИС');

      let from, to; let dl: string | undefined;

      if (p.kind === 'directions') {
        from = p.from && { lon:p.from.lon, lat:p.from.lat };
        to   = p.to   && { lon:p.to.lon,   lat:p.to.lat };
        if (!from || !to) {
          const pt = (from || to)!;
          (target==='from') ? (from = pt) : (to = pt);
          dl = build2GisGeoLink({ ...pt, city: cityHint });
        } else {
          dl = build2GisDirectionsLink({ from, to, city: cityHint, mode: (p.routeType as any) || 'car' });
        }
      }
      if (p.kind === 'geo') {
        const pt = { lon:p.point.lon, lat:p.point.lat };
        (target==='from') ? (from = pt) : (to = pt);
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
      <div className="grid grid-cols-2 gap-2">
        <button onClick={open2gis} className="btn btn-secondary w-full">Открыть 2ГИС</button>
        <button onClick={pasteFromClipboard} className="btn btn-ghost w-full">Вставить из буфера</button>
      </div>

      <div className="text-sm text-white/80">Вставьте ссылку 2ГИС. Поддерживаются <code>2gis.kz</code>, <code>2gis.ru</code>, <code>go.2gis.com</code>.</div>
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Напр.: https://2gis.kz/almaty/geo/..." className="input break-all" />
      <button onClick={parse} className="btn btn-secondary w-full">Распознать</button>

      {(expanded || deepLink || label) && (
        <div className="text-xs space-y-1 text-white/75">
          {expanded && <div>Развёрнуто: <span className="break-all">{expanded}</span></div>}
          {label && <div>Метка: {label}</div>}
          {deepLink && (
            <div className="grid grid-cols-3 gap-2 pt-1">
              <a className="btn btn-primary rounded-xl text-center" target="_blank" href={deepLink}>Открыть</a>
              <button className="btn btn-ghost rounded-xl" onClick={()=>share(deepLink)}>Поделиться</button>
              <button className="btn btn-ghost rounded-xl" onClick={()=>copy(deepLink)}>Копировать</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

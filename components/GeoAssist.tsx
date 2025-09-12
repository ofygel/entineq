'use client';
import { useMemo, useState } from 'react';
import { parse2GisUrl, build2GisDirectionsLink, build2GisGeoLink, formatCoordsLabel } from '@/lib/geo';

type Target = 'auto' | 'from' | 'to';

export default function GeoAssist({
  target = 'auto',
  onExtract,
  cityHint,
  showReverseAddress = false,
}: {
  target?: Target;                           // куда подставлять точку, если единственная
  onExtract: (v: { from?: { lon:number;lat:number }, to?: { lon:number;lat:number }, label?: string }) => void;
  cityHint?: string;                          // подсказка города для билда ссылок
  showReverseAddress?: boolean;               // дергать /api/revgeo
}) {
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastDeepLink, setLastDeepLink] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);

  const isShort = useMemo(() => /^https?:\/\/go\.2gis\.com\//i.test(input.trim()), [input]);

  const handleExpandIfNeeded = async (url: string) => {
    if (!/^https?:\/\//i.test(url)) return url;
    if (!/^https?:\/\/go\.2gis\.com\//i.test(url)) return url;
    const res = await fetch('/api/expand2gis', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
    const js = await res.json();
    if (!res.ok) throw new Error(js?.error || 'expand failed');
    return js.expanded as string;
  };

  const parse = async () => {
    try {
      const maybeExpanded = await handleExpandIfNeeded(input.trim());
      if (maybeExpanded !== input.trim()) setExpanded(maybeExpanded);

      const p = parse2GisUrl(maybeExpanded);
      if (p.kind === 'unknown') {
        alert('Не удалось распознать ссылку 2ГИС. Проверьте формат.');
        return;
      }

      let from, to, deepLink: string | null = null;

      if (p.kind === 'directions') {
        from = p.from ? { lon: p.from.lon, lat: p.from.lat } : undefined;
        to   = p.to   ? { lon: p.to.lon,   lat: p.to.lat   } : undefined;
        if (to) deepLink = build2GisDirectionsLink({ from, to, city: cityHint, mode: (p.routeType as any) || 'car' });
        // если указана только конечная точка — вставим её по цели
        if (!from && !to) return alert('Нет координат в ссылке.');
        if (!from || !to) {
          const pt = (from || to)!;
          if (target === 'from') from = pt; else if (target === 'to') to = pt;
          else to = pt; // auto → считаем конечной
          deepLink = build2GisGeoLink({ lon: pt.lon, lat: pt.lat, city: cityHint });
        }
      }

      if (p.kind === 'geo') {
        const pt = { lon: p.point.lon, lat: p.point.lat };
        if (target === 'from') from = pt; else to = pt;
        deepLink = build2GisGeoLink({ ...pt, city: cityHint });
      }

      setLastDeepLink(deepLink);
      onExtract({ from, to });

      // Желательно подсветить, что распознано
      if (showReverseAddress) {
        try {
          const res = await fetch(`/api/revgeo?lat=${(to||from)!.lat}&lon=${(to||from)!.lon}`);
          const js = await res.json();
          if (res.ok && js?.label) setLabel(js.label);
        } catch {/* ignore */}
      } else {
        const pt = to || from;
        if (pt) setLabel(formatCoordsLabel(pt));
      }
    } catch (e: any) {
      alert(e?.message || 'Ошибка обработки ссылки');
    }
  };

  return (
    <div className="glass rounded-2xl p-3 space-y-3">
      <div className="text-sm text-white/80">
        Вставьте ссылку из приложения 2ГИС (поддерживаются <code>2gis.kz</code>, <code>2gis.ru</code>, короткие <code>go.2gis.com</code>).
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Напр.: https://2gis.kz/almaty/geo/9430.../76.892832,43.224556"
          className="flex-1 rounded-xl px-3 py-2 bg-white/10 border border-white/20 outline-none"
        />
        <button onClick={parse} className="btn btn-secondary rounded-xl">Распознать</button>
      </div>

      {(expanded || label || lastDeepLink) && (
        <div className="text-xs space-y-1 text-white/75">
          {expanded && <div>Развёрнуто: <span className="break-all">{expanded}</span></div>}
          {label && <div>Метка: {label}</div>}
          {lastDeepLink && (
            <div className="pt-1">
              <a href={lastDeepLink} target="_blank" className="btn btn-primary w-full rounded-xl text-center">
                Открыть в 2ГИС
              </a>
            </div>
          )}
        </div>
      )}

      <div className="text-[11px] text-white/50">
        Подсказка: “Открыть в 2ГИС” создаёт диплинк — исполнитель откроет адрес без ручного ввода.
      </div>
    </div>
  );
}

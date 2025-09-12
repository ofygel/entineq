const DGIS_HOSTS = [
  '2gis.ru','www.2gis.ru',
  '2gis.kz','www.2gis.kz',
  'go.2gis.com'
];

export type DGisPoint = { lon: number; lat: number; objectId?: string };
export type Parsed2Gis =
  | { kind: 'directions'; city?: string; routeType?: string; from?: DGisPoint; to?: DGisPoint }
  | { kind: 'geo'; city?: string; point: DGisPoint }
  | { kind: 'unknown' };

/**
 * Парсит:
 *  - https://2gis.kz/almaty/geo/<id>/<lon,%20lat>?m=<lon,%20lat>/<zoom>
 *  - https://2gis.ru/.../directions/tab/<type>/points/<from>|<to> (с ;<objId>)
 *  - legacy /routeSearch/...
 *  - короткие go.2gis.com/<code> (смотри API-роут /api/expand2gis для развёртки)
 */
export function parse2GisUrl(raw: string): Parsed2Gis {
  try {
    const u = new URL(raw);

    // Хост должен быть от 2ГИС
    if (!DGIS_HOSTS.some(h => u.hostname.endsWith(h.replace('www.','')))) return { kind: 'unknown' };

    const host = u.hostname;
    const path = decodeURIComponent(u.pathname);
    const pathParts = path.split('/').filter(Boolean); // ['almaty','geo','<id>','<lon,lat>']

    // 1) /<city>/geo/<id>/<lon,lat>
    const geoIdx = pathParts.findIndex(p => p === 'geo');
    if (geoIdx !== -1) {
      const city = pathParts[geoIdx - 1]; // может не быть
      const objectId = pathParts[geoIdx + 1];
      const coords = (pathParts[geoIdx + 2] || '').split(',');
      const lon = Number(coords[0]); const lat = Number(coords[1]);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        return { kind: 'geo', city, point: { lon, lat, objectId } };
      }
    }

    // 2) /directions(/tab/<type>)?/points/<from>|<to>|...
    {
      const m = path.match(/\/directions(?:\/tab\/(\w+))?\/points\/(.+)$/);
      if (m) {
        const routeType = m[1] || 'car';
        const chain = m[2].split('|').filter(Boolean);
        const parsePoint = (s: string): DGisPoint | undefined => {
          // "lon,lat;objectId?" — иногда без objectId
          const [coord, objectId] = s.split(';');
          const [lon, lat] = coord.split(',').map(Number);
          if (Number.isFinite(lat) && Number.isFinite(lon)) return { lon, lat, objectId };
        };
        const from = chain[0] ? parsePoint(chain[0]) : undefined;
        const to   = chain.length ? parsePoint(chain[chain.length-1]) : undefined;
        return { kind: 'directions', routeType, from, to };
      }
    }

    // 3) legacy: /{city}/routeSearch/rsType/<type>/from/<from>/to/<to>
    {
      const m = path.match(/\/([^/]+)\/routeSearch\/rsType\/(\w+)\/from\/([^/]+)\/to\/([^/]+)/);
      if (m) {
        const city = m[1];
        const routeType = m[2];
        const splitLegacy = (s: string): DGisPoint | undefined => {
          // "lon,lat╎address╎id" — нам нужны lon/lat
          const coord = s.split('╎')[0];
          const [lon, lat] = coord.split(',').map(Number);
          if (Number.isFinite(lat) && Number.isFinite(lon)) return { lon, lat };
        };
        return { kind: 'directions', city, routeType, from: splitLegacy(m[3]), to: splitLegacy(m[4]) };
      }
    }

    // 4) короткие ссылки go.2gis.com — их не разбираем здесь (нужна развёртка), вернём unknown
    if (host.includes('go.2gis.com')) {
      return { kind: 'unknown' };
    }

    return { kind: 'unknown' };
  } catch {
    return { kind: 'unknown' };
  }
}

/** Канонический диплинк маршрута. Работает и как https (веб/приложение перехватит). */
export function build2GisDirectionsLink(params: {
  from?: DGisPoint; to: DGisPoint; mode?: 'car'|'bus'|'pedestrian'|'bicycle'|'scooter'|'truck'|'taxi'; city?: string;
}) {
  const type = params.mode || 'car';
  const p = (pt?: DGisPoint) => pt ? `${pt.lon},${pt.lat}${pt.objectId?`;${pt.objectId}`:''}` : '';
  const from = p(params.from);
  const to = p(params.to);
  const points = params.from ? `${from}|${to}` : `|${to}`;
  const cityPrefix = params.city ? `/${encodeURIComponent(params.city)}` : '';
  return `https://2gis.ru${cityPrefix}/directions/tab/${type}/points/${points}`;
}

/** Канонический диплинк на точку (экран объекта/геопина). */
export function build2GisGeoLink(point: DGisPoint & { city?: string }) {
  const cityPrefix = point.city ? `/${encodeURIComponent(point.city)}` : '';
  const id = point.objectId ?? 'geo';
  return `https://2gis.ru${cityPrefix}/geo/${id}/${point.lon},${point.lat}`;
}

/** Утилита: из координат сделать простой человекочитаемый ярлык (без внешних API). */
export function formatCoordsLabel(pt: {lat:number;lon:number}) {
  return `${pt.lat.toFixed(6)}, ${pt.lon.toFixed(6)}`;
}

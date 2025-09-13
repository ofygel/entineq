const DGIS_HOSTS = ['2gis.ru','www.2gis.ru','2gis.kz','www.2gis.kz','go.2gis.com'];

export type DGisPoint = { lon: number; lat: number; objectId?: string };
export type Parsed2Gis =
  | { kind: 'directions'; city?: string; routeType?: string; from?: DGisPoint; to?: DGisPoint }
  | { kind: 'geo'; city?: string; point: DGisPoint }
  | { kind: 'unknown' };

export function parse2GisUrl(raw: string): Parsed2Gis {
  try {
    const u = new URL(raw);
    if (!DGIS_HOSTS.some(h => u.hostname.endsWith(h.replace('www.','')))) return { kind: 'unknown' };
    const path = decodeURIComponent(u.pathname);
    const parts = path.split('/').filter(Boolean);

    // /<city>/geo/<id>/<lon,lat>
    {
      const i = parts.findIndex(p => p === 'geo');
      if (i !== -1) {
        const city = parts[i-1];
        const objectId = parts[i+1];
        const [lonS, latS] = (parts[i+2] || '').split(',');
        const lon = Number(lonS), lat = Number(latS);
        if (Number.isFinite(lat) && Number.isFinite(lon)) return { kind: 'geo', city, point: { lon, lat, objectId } };
      }
    }

    // /directions(/tab/<type>)?/points/<from>|<to>|...
    {
      const m = path.match(/\/directions(?:\/tab\/(\w+))?\/points\/(.+)$/);
      if (m) {
        const routeType = m[1] || 'car';
        const chain = m[2].split('|').filter(Boolean);
        const parsePoint = (s: string): DGisPoint | undefined => {
          const [coord, objectId] = s.split(';');
          const [lon, lat] = coord.split(',').map(Number);
          if (Number.isFinite(lat) && Number.isFinite(lon)) return { lon, lat, objectId };
        };
        const from = chain[0] ? parsePoint(chain[0]) : undefined;
        const to   = chain.length ? parsePoint(chain[chain.length-1]) : undefined;
        return { kind: 'directions', routeType, from, to };
      }
    }

    // legacy: /{city}/routeSearch/rsType/<type>/from/<from>/to/<to>
    {
      const m = path.match(/\/([^/]+)\/routeSearch\/rsType\/(\w+)\/from\/([^/]+)\/to\/([^/]+)/);
      if (m) {
        const city = m[1], routeType = m[2];
        const parseLegacy = (s: string): DGisPoint | undefined => {
          const [lonS, latS] = s.split('╎')[0].split(',');
          const lon = Number(lonS), lat = Number(latS);
          if (Number.isFinite(lat) && Number.isFinite(lon)) return { lon, lat };
        };
        return { kind: 'directions', city, routeType, from: parseLegacy(m[3]), to: parseLegacy(m[4]) };
      }
    }

    if (u.hostname.includes('go.2gis.com')) return { kind: 'unknown' };
    return { kind: 'unknown' };
  } catch { return { kind: 'unknown' }; }
}

export function build2GisDirectionsLink(p: { from?: DGisPoint; to: DGisPoint; mode?: 'car'|'bus'|'pedestrian'|'bicycle'|'scooter'|'truck'|'taxi'; city?: string }) {
  const type = p.mode || 'car';
  const pp = (pt?: DGisPoint) => pt ? `${pt.lon},${pt.lat}${pt.objectId?`;${pt.objectId}`:''}` : '';
  const points = p.from ? `${pp(p.from)}|${pp(p.to)}` : `|${pp(p.to)}`;
  const cityPrefix = p.city ? `/${encodeURIComponent(p.city)}` : '';
  return `https://2gis.ru${cityPrefix}/directions/tab/${type}/points/${points}`;
}
export function build2GisGeoLink(pt: DGisPoint & { city?: string }) {
  const cityPrefix = pt.city ? `/${encodeURIComponent(pt.city)}` : '';
  const id = pt.objectId ?? 'geo';
  return `https://2gis.ru${cityPrefix}/geo/${id}/${pt.lon},${pt.lat}`;
}
export const formatCoordsLabel = (pt: {lat:number;lon:number}) => `${pt.lat.toFixed(6)}, ${pt.lon.toFixed(6)}`;

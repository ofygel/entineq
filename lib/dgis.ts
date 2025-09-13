export async function dgisSuggest(query: string, city?: string) {
  const key = process.env.NEXT_PUBLIC_2GIS_API_KEY;
  if (!key) return [];
  const params = new URLSearchParams({ q: query, key });
  if (city) params.set('city', city);
  const res = await fetch(`https://catalog.api.2gis.com/3.0/suggests?${params}`);
  if (!res.ok) return [];
  const j = await res.json();
  return (j?.result?.items ?? []).map((it:any)=> ({
    label: it.subtitle ? `${it.name}, ${it.subtitle}` : it.name,
    lon: it.point?.lon, lat: it.point?.lat
  })).filter((x:any)=> Number.isFinite(x.lat) && Number.isFinite(x.lon));
}
export function open2GisApp(){ const url='https://go.2gis.com'; try{ window.open(url,'_blank'); }catch{ location.href=url; } }
export async function getMyLocation(): Promise<{lat:number;lon:number}|null>{
  return new Promise((resolve)=> {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos)=> resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      ()=> resolve(null), { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
}

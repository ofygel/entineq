'use client';
import { useEffect, useRef } from 'react';

interface MapPickerProps {
  from?: { lat: number; lon: number } | null;
  to?: { lat: number; lon: number } | null;
  onPick: (coords: { lat: number; lon: number }) => void;
}

export default function TwoGisMapPicker({ from, to, onPick }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: any;
    const load = async () => {
      if (typeof window === 'undefined') return;
      if (!(window as any).DG) {
        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://maps.api.2gis.ru/2.0/loader.js?pkg=full';
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }
      await (window as any).DG.then((DG: any) => {
        map = DG.map(mapRef.current!, { center: [43.2383, 76.9453], zoom: 14 });
        map.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          onPick({ lat, lon: lng });
        });
      });
    };
    load();
    return () => { if (map) map.remove(); };
  }, [onPick]);
  return <div ref={mapRef} className="w-full h-48 rounded-xl overflow-hidden" />;
}

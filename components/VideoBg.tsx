'use client';
import { useEffect, useState } from 'react';

export default function VideoBg() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/video-bg', { cache: 'no-store' });
        const json = await res.json().catch(() => ({} as any));
        if (!alive) return;
        const url = typeof json?.url === 'string' && json.url.length > 0 ? json.url : '/bg.mp4';
        setSrc(url);
      } catch {
        if (!alive) return;
        setSrc('/bg.mp4');
      }
    })();
    return () => { alive = false; };
  }, []);

  // Пока не знаем URL — не рендерим <video>, чтобы не было «чёрного мигания»
  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      {src && (
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
      {/* мягкий градиент — НЕ перекрывает видео полностью */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.55))]" />
    </div>
  );
}

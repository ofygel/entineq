'use client';
import { useEffect, useState } from 'react';

export default function VideoBg() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/video-bg', { cache: 'no-store' });
        const j = await r.json().catch(() => ({}));
        if (!alive) return;
        setSrc(j.url || j.fallback || '/bg.mp4');
      } catch {
        if (alive) setSrc('/bg.mp4');
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      {src ? (
        <video
          key={src}
          className="w-full h-full object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
          poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div className="w-full h-full bg-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
    </div>
  );
}

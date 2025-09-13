'use client';
import { useEffect, useState } from 'react';

export default function VideoBg() {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/video-bg', { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled) setSrc(data.url || '/bg.mp4');
      } catch {
        if (!cancelled) setSrc('/bg.mp4');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <video
        key={src || 'fallback'}
        className="w-full h-full object-cover opacity-70"
        autoPlay
        muted
        loop
        playsInline
        poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
      >
        {src ? <source src={src} type="video/mp4" /> : null}
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
    </div>
  );
}

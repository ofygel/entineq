'use client';
import { useEffect, useRef, useState } from 'react';
import { fetchActiveBackgroundPublicUrl } from '@/lib/db';

export default function VideoBg() {
  const vref = useRef<HTMLVideoElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchActiveBackgroundPublicUrl().then(u => { if (alive) setSrc(u); }).catch(()=>{});
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    const play = async () => {
      try {
        v.muted = true;
        // @ts-ignore
        v.playsInline = true;
        await v.play();
      } catch {}
    };
    play();
    v.addEventListener('canplay', play);
    return () => v.removeEventListener('canplay', play);
  }, [src]);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none" style={{ background: 'radial-gradient(120% 120% at 50% 0%, #1a1b1f 0%, #0b0b0d 60%)' }}>
      {src && (
        <video
          ref={vref}
          className="w-full h-full object-cover opacity-75 transition-opacity duration-700"
          autoPlay muted loop playsInline preload="auto"
          poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
        >
          <source src={src} />
        </video>
      )}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}

'use client';
import { useEffect, useRef, useState } from 'react';

export default function VideoBg() {
  const vref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    const play = async () => {
      try {
        v.muted = true;
        await v.play();
        setReady(true);
      } catch {
        setError(true);
      }
    };
    const onError = () => setError(true);
    v.addEventListener('canplay', play);
    v.addEventListener('error', onError);
    return () => {
      v.removeEventListener('canplay', play);
      v.removeEventListener('error', onError);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
        // аккуратный градиент как фоллбек до старта видео
        background: 'radial-gradient(120% 120% at 50% 0%, #1a1b1f 0%, #0b0b0d 60%)',
      }}
    >
      {!error && (
        <video
          ref={vref}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            ready ? 'opacity-80' : 'opacity-0'
          }`}
          playsInline
          loop
          preload="auto"
          muted
          src="/bg.mp4"
        />
      )}
      <div className="absolute inset-0 bg-black/25" />
    </div>
  );
}

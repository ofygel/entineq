'use client';
import { useEffect, useRef } from 'react';

export default function VideoBg() {
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    // На всякий случай: принудительно пытаемся запустить
    const tryPlay = async () => {
      try {
        // важные флаги для автоплея на мобилах
        v.muted = true;
        // iOS любит playsInline:
        // уже проставлено в JSX, но дубль на всякий случай
        // @ts-ignore
        v.playsInline = true;
        await v.play();
      } catch (_) {
        // если браузер откажет — оставим просто постер/первый кадр
      }
    };
    // пробуем сразу и после canplay
    tryPlay();
    v.addEventListener('canplay', tryPlay);
    return () => v.removeEventListener('canplay', tryPlay);
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 pointer-events-none">
      <video
        ref={vref}
        className="w-full h-full object-cover opacity-70"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // прозрачный 1x1 пиксель — без 404
        poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
      >
        {/* если потом добавишь webm — положи public/bg.webm и раскомментируй следующую строку */}
        {/* <source src="/bg.webm" type="video/webm" /> */}
        <source src="/bg.mp4" type="video/mp4" />
      </video>
      {/* мягкий оверлей, чтобы контент читался */}
      <div className="absolute inset-0 bg-black/15" />
    </div>
  );
}

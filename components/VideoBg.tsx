'use client';
export default function VideoBg() {
return (
<div aria-hidden className="fixed inset-0 -z-10">
<video className="w-full h-full object-cover opacity-70" autoPlay muted loop playsInline
poster="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==">
<source src="/bg.mp4" type="video/mp4" />
</video>
<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
</div>
);
}

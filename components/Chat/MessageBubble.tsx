'use client';
export default function MessageBubble({ mine, text, time }: { mine: boolean; text: string; time: string; }) {
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-glass
        ${mine ? 'bg-white text-black' : 'bg-white/10 text-white border border-white/15 backdrop-blur'}`}>
        <div className="whitespace-pre-wrap break-words">{text}</div>
        <div className={`text-[10px] mt-1 ${mine ? 'text-black/60':'text-white/60'}`}>{time}</div>
      </div>
    </div>
  );
}

'use client';
import Link from 'next/link';

export default function SupportCard() {
  return (
    <div className="space-y-4 text-center">
      <h3 className="text-lg font-semibold">Поддержка</h3>
      <p className="text-sm text-white/80">Если у вас возникли вопросы, напишите нам.</p>
      <Link href="https://t.me/" target="_blank" className="btn btn-primary">Telegram</Link>
    </div>
  );
}

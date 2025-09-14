'use client';
import { useState } from 'react';

export default function FeedbackForm({ onDone }: { onDone: () => void }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async () => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, text }),
      });
      setSent(true);
    } catch {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div>Спасибо за отзыв!</div>
        <button className="btn" onClick={onDone}>Закрыть</button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Оставить отзыв</h3>
      <div className="flex space-x-2">
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            onClick={() => setRating(n)}
            className={n <= rating ? 'text-yellow-400' : 'text-white/40'}
          >★</button>
        ))}
      </div>
      <textarea
        className="input w-full"
        placeholder="Комментарий"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <button className="btn" onClick={onDone}>Отмена</button>
        <button className="btn btn-primary" onClick={submit}>Отправить</button>
      </div>
    </div>
  );
}

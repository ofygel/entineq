"use client";
import { useOrder } from '@/lib/order-store';

const items = [
  { step: 'home', label: 'Главная' },
  { step: 'start', label: 'Заказ' },
  { step: 'history', label: 'История' },
  { step: 'feedback', label: 'Отзыв' },
  { step: 'support', label: 'Поддержка' },
];

export default function BottomNav() {
  const { setStep, openModal, closeModal } = useOrder();
  return (
    <nav className="fixed bottom-3 left-0 right-0 z-40">
      <div className="mx-auto max-w-md px-3">
        <div className="glass rounded-2xl p-2 flex items-center justify-between">
          {items.map((it) => (
            <button
              key={it.label}
              onClick={() => {
                if (it.step === 'home') {
                  setStep('start');
                  closeModal();
                } else {
                  setStep(it.step as any);
                  openModal();
                }
              }}
              className="px-3 py-2 text-sm rounded-xl text-white/80 hover:text-white hover:bg-white/10"
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

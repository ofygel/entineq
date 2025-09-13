'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Modal from './Modal';
import TwoGisMapPicker from './TwoGisMapPicker';
import AddressInput from './AddressInput';
import PriceBadge from './PriceBadge';
import OrderSummaryCard from './OrderSummaryCard';
import FinishCard from './FinishCard';
import { useOrder } from '@/lib/order-store';

export default function OrderModal() {
  const { open, closeModal, step, setStep, draft, patchDraft } = useOrder();
  const [showComment, setShowComment] = useState(false);
  const [active, setActive] = useState<'from' | 'to'>('from');

  const onPick = (coords: { lat: number; lon: number }) => {
    if (active === 'from') patchDraft({ from: coords, fromText: `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}` });
    else patchDraft({ to: coords, toText: `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}` });
  };

  const canNext = draft.from && draft.fromText && draft.to && draft.toText;

  return (
    <Modal open={open} onClose={closeModal}>
      <AnimatePresence mode="wait">
        {step === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <TwoGisMapPicker from={draft.from} to={draft.to} onPick={onPick} />
            <div className="space-y-3">
              <div onClick={() => setActive('from')}>
                <AddressInput
                  label="Откуда"
                  value={draft.fromText}
                  onSelect={(it) => patchDraft({ from: it.point, fromText: it.text })}
                />
              </div>
              <div onClick={() => setActive('to')}>
                <AddressInput
                  label="Куда"
                  value={draft.toText}
                  onSelect={(it) => patchDraft({ to: it.point, toText: it.text })}
                />
              </div>
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <input type="radio" checked={draft.type === 'TAXI'} onChange={() => patchDraft({ type: 'TAXI' })} />
                  <span>Женское такси</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" checked={draft.type === 'DELIVERY'} onChange={() => patchDraft({ type: 'DELIVERY' })} />
                  <span>Доставка</span>
                </label>
              </div>
              {draft.type === 'DELIVERY' && (
                <div className="flex space-x-2">
                  <input
                    className="input flex-1"
                    placeholder="квартира"
                    value={draft.apt || ''}
                    onChange={(e) => patchDraft({ apt: e.target.value })}
                  />
                  <input
                    className="input flex-1"
                    placeholder="этаж"
                    value={draft.floor || ''}
                    onChange={(e) => patchDraft({ floor: e.target.value })}
                  />
                </div>
              )}
              <button className="text-sm text-white/80" onClick={() => setShowComment((s) => !s)}>
                Оставить комментарий?
              </button>
              {showComment && (
                <textarea
                  className="input w-full"
                  value={draft.comment || ''}
                  onChange={(e) => patchDraft({ comment: e.target.value })}
                />
              )}
              <div className="flex justify-end">
                <button className="btn btn-primary" disabled={!canNext} onClick={() => setStep('details')}>
                  Далее
                </button>
              </div>
            </div>
            <PriceBadge />
          </motion.div>
        )}
        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <OrderSummaryCard />
            <div className="flex justify-end space-x-2">
              <button className="btn" onClick={() => setStep('start')}>Назад</button>
              <button className="btn btn-primary" onClick={() => setStep('searching')}>Опубликовать заказ</button>
            </div>
          </motion.div>
        )}
        {step === 'searching' && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center space-y-4"
          >
            <div>Заказ отправлен. Исполнители видят ваш заказ в Telegram.</div>
            <button className="btn btn-primary" onClick={() => setStep('in_progress')}>Имитировать принятие</button>
          </motion.div>
        )}
        {step === 'in_progress' && (
          <motion.div
            key="in_progress"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center space-y-4"
          >
            <div>Исполнитель в пути...</div>
            <button className="btn btn-primary" onClick={() => setStep('completed')}>Завершить</button>
          </motion.div>
        )}
        {step === 'completed' && (
          <motion.div
            key="completed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <FinishCard />
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

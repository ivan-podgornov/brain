import { describe, expect, it, vi } from 'vitest';

import { EventEmitter } from '../src/event-emitter';

type Events = {
  tick: never;
  update: number;
};

describe('EventEmitter', () => {
  describe('#removeEventListener', () => {
    it('Снимает обработчик, и при следующем порождении события он не вызывается', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();
      emitter.addEventListener('tick', listener);

      emitter.removeEventListener('tick', listener);
      emitter.dispatchEvent('tick');

      expect(listener).not.toHaveBeenCalled();
    });

    it('После снятия обработчика остальные обработчики события продолжают вызываться', () => {
      const emitter = new EventEmitter<Events>();
      const removed = vi.fn();
      const remaining = vi.fn();
      emitter.addEventListener('tick', removed);
      emitter.addEventListener('tick', remaining);

      emitter.removeEventListener('tick', removed);
      emitter.dispatchEvent('tick');

      expect(remaining).toHaveBeenCalledOnce();
    });

    it('Снимает обработчик только с указанного события', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();
      emitter.addEventListener('tick', listener);
      emitter.addEventListener('update', listener);

      emitter.removeEventListener('tick', listener);
      emitter.dispatchEvent('update', 1);

      expect(listener).toHaveBeenCalledOnce();
    });

    it('Если одну функцию назначили на событие дважды, один вызов снимает её полностью', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();
      emitter.addEventListener('tick', listener);
      emitter.addEventListener('tick', listener);

      emitter.removeEventListener('tick', listener);
      emitter.dispatchEvent('tick');

      expect(listener).not.toHaveBeenCalled();
    });

    it('Если снять обработчик дважды, не выбрасывает ошибку', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();
      emitter.addEventListener('tick', listener);
      emitter.removeEventListener('tick', listener);

      expect(() => emitter.removeEventListener('tick', listener)).not.toThrow();
    });

    it('Если у события нет обработчиков, не выбрасывает ошибку', () => {
      const emitter = new EventEmitter<Events>();

      expect(() => emitter.removeEventListener('tick', vi.fn())).not.toThrow();
    });

    it('Если обработчик не назначали, не снимает остальные', () => {
      const emitter = new EventEmitter<Events>();
      const assigned = vi.fn();
      emitter.addEventListener('tick', assigned);

      emitter.removeEventListener('tick', vi.fn());
      emitter.dispatchEvent('tick');

      expect(assigned).toHaveBeenCalledOnce();
    });
  });
});

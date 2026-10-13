import { describe, expect, it, vi } from 'vitest';

import { EventTarget } from '../../src/event-target';

import { optionsCases, type TestEvents } from './helpers';

describe('EventTarget', () => {
  describe('#removeEventListener', () => {
    it.each(optionsCases)(
      'Если обработчик назначен с опциями: $name, снимает его, и при следующем порождении события он не вызывается',
      ({ options }) => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener, options);

        target.removeEventListener('tick', listener);
        target.dispatchEvent('tick');

        expect(listener).not.toHaveBeenCalled();
      }
    );

    it('После снятия обработчика остальные обработчики события продолжают вызываться', () => {
      const target = new EventTarget<TestEvents>();
      const removed = vi.fn();
      const remaining = vi.fn();
      target.addEventListener('tick', removed);
      target.addEventListener('tick', remaining);

      target.removeEventListener('tick', removed);
      target.dispatchEvent('tick');

      expect(remaining).toHaveBeenCalledOnce();
    });

    it('Снимает обработчик только с указанного события', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();
      target.addEventListener('tick', listener);
      target.addEventListener('update', listener);

      target.removeEventListener('tick', listener);
      target.dispatchEvent('update', 1);

      expect(listener).toHaveBeenCalledOnce();
    });

    it('Если одну функцию назначили на событие дважды, один вызов снимает её полностью', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();
      target.addEventListener('tick', listener);
      target.addEventListener('tick', listener);

      target.removeEventListener('tick', listener);
      target.dispatchEvent('tick');

      expect(listener).not.toHaveBeenCalled();
    });

    it('Если снять обработчик дважды, не выбрасывает ошибку', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();
      target.addEventListener('tick', listener);
      target.removeEventListener('tick', listener);

      expect(() => target.removeEventListener('tick', listener)).not.toThrow();
    });

    it('Если у события нет обработчиков, не выбрасывает ошибку', () => {
      const target = new EventTarget<TestEvents>();

      expect(() => target.removeEventListener('tick', vi.fn())).not.toThrow();
    });

    it('Если обработчик не назначали, не снимает остальные', () => {
      const target = new EventTarget<TestEvents>();
      const assigned = vi.fn();
      target.addEventListener('tick', assigned);

      target.removeEventListener('tick', vi.fn());
      target.dispatchEvent('tick');

      expect(assigned).toHaveBeenCalledOnce();
    });
  });
});

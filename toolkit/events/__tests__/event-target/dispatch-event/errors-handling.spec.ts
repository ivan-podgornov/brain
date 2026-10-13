import { describe, expect, it, vi } from 'vitest';

import { EventTarget } from '../../../src/event-target';
import type { TestEvents } from '../helpers';

describe('EventTarget', () => {
  describe('#dispatchEvent', () => {
    describe('При исключении в обработчике', () => {
      it('Не пробрасывает исключение наружу', () => {
        const onError = vi.fn();
        const target = new EventTarget<TestEvents>({ onError });
        target.addEventListener('tick', () => {
          throw new Error('boom');
        });

        expect(() => target.dispatchEvent('tick')).not.toThrow();
      });

      it('Вызывает обработчики, назначенные после упавшего', () => {
        const onError = vi.fn();
        const target = new EventTarget<TestEvents>({ onError });
        const next = vi.fn();
        target.addEventListener('tick', () => {
          throw new Error('boom');
        });
        target.addEventListener('tick', next);

        target.dispatchEvent('tick');

        expect(next).toHaveBeenCalledOnce();
      });

      it('Не снимает упавший обработчик, он вызывается при следующем порождении события', () => {
        const onError = vi.fn();
        const target = new EventTarget<TestEvents>({ onError });
        const failing = vi.fn(() => {
          throw new Error('boom');
        });
        target.addEventListener('tick', failing);

        target.dispatchEvent('tick');
        target.dispatchEvent('tick');

        expect(failing).toHaveBeenCalledTimes(2);
      });

      it('Если в конструктор передан onError, передаёт выброшенное исключение в onError', () => {
        const error = new Error('boom');
        const onError = vi.fn();
        const target = new EventTarget<TestEvents>({ onError });
        target.addEventListener('tick', () => {
          throw error;
        });

        target.dispatchEvent('tick');

        expect(onError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если в конструктор не передан onError, исключение игнорируется', () => {
        const target = new EventTarget<TestEvents>();
        target.addEventListener('tick', () => {
          throw new Error('boom');
        });

        expect(() => target.dispatchEvent('tick')).not.toThrow();
      });

      it('Если упали несколько обработчиков, передаёт в onError исключение каждого', () => {
        const first = new Error('first');
        const second = new Error('second');
        const onError = vi.fn();
        const target = new EventTarget<TestEvents>({ onError });
        target.addEventListener('tick', () => {
          throw first;
        });
        target.addEventListener('tick', () => {
          throw second;
        });

        target.dispatchEvent('tick');

        expect(onError.mock.calls).toEqual([[first], [second]]);
      });

      it('Если обработчик, переданный в onError выполнится с ошибкой, исключение не выбросится наружу', () => {
        const onError = vi.fn().mockThrow(new Error());
        const target = new EventTarget<TestEvents>({ onError });
        const next = vi.fn();
        target.addEventListener('tick', () => {
          throw new Error('boom');
        });
        target.addEventListener('tick', next);

        expect(() => target.dispatchEvent('tick')).not.toThrow();
      });

      it('Если обработчик, переданный в onError выполнится с ошибкой, следующие обработчики продолжат вызываться', () => {
        const onError = vi.fn().mockThrow(new Error());
        const target = new EventTarget<TestEvents>({ onError });
        const next = vi.fn();
        target.addEventListener('tick', () => {
          throw new Error('boom');
        });
        target.addEventListener('tick', next);

        target.dispatchEvent('tick');

        expect(next).toHaveBeenCalledOnce();
      });
    });
  });
});

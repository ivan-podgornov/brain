import { describe, expect, it, vi } from 'vitest';

import { EventEmitter } from '../../src/event-emitter';

type Events = {
  tick: never;
};

describe('EventEmitter', () => {
  describe('#dispatchEvent', () => {
    describe('При исключении в обработчике', () => {
      it('Не пробрасывает исключение наружу', () => {
        const onError = vi.fn();
        const emitter = new EventEmitter<Events>({ onError });
        emitter.addEventListener('tick', () => {
          throw new Error('boom');
        });

        expect(() => emitter.dispatchEvent('tick')).not.toThrow();
      });

      it('Вызывает обработчики, назначенные после упавшего', () => {
        const onError = vi.fn();
        const emitter = new EventEmitter<Events>({ onError });
        const next = vi.fn();
        emitter.addEventListener('tick', () => {
          throw new Error('boom');
        });
        emitter.addEventListener('tick', next);

        emitter.dispatchEvent('tick');

        expect(next).toHaveBeenCalledOnce();
      });

      it('Не снимает упавший обработчик, он вызывается при следующем порождении события', () => {
        const onError = vi.fn();
        const emitter = new EventEmitter<Events>({ onError });
        const failing = vi.fn(() => {
          throw new Error('boom');
        });
        emitter.addEventListener('tick', failing);

        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('tick');

        expect(failing).toHaveBeenCalledTimes(2);
      });

      it('Передаёт выброшенное исключение в onError', () => {
        const error = new Error('boom');
        const onError = vi.fn();
        const emitter = new EventEmitter<Events>({ onError });
        emitter.addEventListener('tick', () => {
          throw error;
        });

        emitter.dispatchEvent('tick');

        expect(onError).toHaveBeenCalledExactlyOnceWith(error);
      });

      it('Если упали несколько обработчиков, передаёт в onError исключение каждого', () => {
        const first = new Error('first');
        const second = new Error('second');
        const onError = vi.fn();
        const emitter = new EventEmitter<Events>({ onError });
        emitter.addEventListener('tick', () => {
          throw first;
        });
        emitter.addEventListener('tick', () => {
          throw second;
        });

        emitter.dispatchEvent('tick');

        expect(onError.mock.calls).toEqual([[first], [second]]);
      });
    });
  });
});

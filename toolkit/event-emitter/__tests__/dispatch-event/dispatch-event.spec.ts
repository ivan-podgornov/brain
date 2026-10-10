import { describe, expect, it, vi } from 'vitest';

import { EventEmitter } from '../../src/event-emitter';

type Events = {
  tick: never;
  update: number;
};

describe('EventEmitter', () => {
  describe('#dispatchEvent', () => {
    it('Вызывает обработчики, назначенные на событие с указанным названием', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();
      emitter.addEventListener('tick', listener);

      emitter.dispatchEvent('tick');

      expect(listener).toHaveBeenCalledOnce();
    });

    it('Не вызывает обработчики, назначенные на другие события', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();
      emitter.addEventListener('update', listener);

      emitter.dispatchEvent('tick');

      expect(listener).not.toHaveBeenCalled();
    });

    it('Вызывает обработчик со значением, переданным вторым параметром', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();
      emitter.addEventListener('update', listener);

      emitter.dispatchEvent('update', 5);

      expect(listener).toHaveBeenCalledExactlyOnceWith(5);
    });

    it('Вызывает обработчики в порядке их назначения', () => {
      const emitter = new EventEmitter<Events>();
      const calls: string[] = [];
      emitter.addEventListener('tick', () => calls.push('first'));
      emitter.addEventListener('tick', () => calls.push('second'));

      emitter.dispatchEvent('tick');

      expect(calls).toEqual(['first', 'second']);
    });

    it('Если у события нет обработчиков, не выбрасывает ошибку', () => {
      const emitter = new EventEmitter<Events>();

      expect(() => emitter.dispatchEvent('tick')).not.toThrow();
    });

    it('Если обработчик назначили уже после порождения события, он не вызывается', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();

      emitter.dispatchEvent('tick');
      emitter.addEventListener('tick', listener);

      expect(listener).not.toHaveBeenCalled();
    });
  });
});

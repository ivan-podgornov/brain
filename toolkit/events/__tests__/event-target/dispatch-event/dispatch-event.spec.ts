import { describe, expect, it, vi } from 'vitest';

import { EventTarget } from '../../../src/event-target';
import type { TestEvents } from '../helpers';

describe('EventTarget', () => {
  describe('#dispatchEvent', () => {
    it('Вызывает обработчики, назначенные на событие с указанным названием', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();
      target.addEventListener('tick', listener);

      target.dispatchEvent('tick');

      expect(listener).toHaveBeenCalledOnce();
    });

    it('Не вызывает обработчики, назначенные на другие события', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();
      target.addEventListener('update', listener);

      target.dispatchEvent('tick');

      expect(listener).not.toHaveBeenCalled();
    });

    it('Вызывает обработчик со значением, переданным вторым параметром', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();
      target.addEventListener('update', listener);

      target.dispatchEvent('update', 5);

      expect(listener).toHaveBeenCalledExactlyOnceWith(5);
    });

    it('Вызывает обработчики в порядке их назначения', () => {
      const target = new EventTarget<TestEvents>();
      const calls: string[] = [];
      target.addEventListener('tick', () => calls.push('first'));
      target.addEventListener('tick', () => calls.push('second'));

      target.dispatchEvent('tick');

      expect(calls).toEqual(['first', 'second']);
    });

    it('Если у события нет обработчиков, не выбрасывает ошибку', () => {
      const target = new EventTarget<TestEvents>();

      expect(() => target.dispatchEvent('tick')).not.toThrow();
    });

    it('Если обработчик назначили уже после порождения события, он не вызывается', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();

      target.dispatchEvent('tick');
      target.addEventListener('tick', listener);

      expect(listener).not.toHaveBeenCalled();
    });
  });
});

import { describe, expect, it, vi } from 'vitest';

import { EventEmitter } from '../../src/event-emitter';

type Events = {
  tick: never;
  update: number;
};

describe('EventEmitter', () => {
  describe('#addEventListener', () => {
    it('Назначает обработчик, который вызывается каждый раз при порождении события', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();

      emitter.addEventListener('tick', listener);
      emitter.dispatchEvent('tick');
      emitter.dispatchEvent('tick');
      emitter.dispatchEvent('tick');

      expect(listener).toHaveBeenCalledTimes(3);
    });

    it('Если одну функцию назначили на событие дважды, вызывает её один раз за порождение', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();

      emitter.addEventListener('tick', listener);
      emitter.addEventListener('tick', listener);
      emitter.dispatchEvent('tick');

      expect(listener).toHaveBeenCalledOnce();
    });

    it('Если одну функцию назначили на разные события, вызывает её при каждом из них', () => {
      const emitter = new EventEmitter<Events>();
      const listener = vi.fn();

      emitter.addEventListener('tick', listener);
      emitter.addEventListener('update', listener);
      emitter.dispatchEvent('tick');
      emitter.dispatchEvent('update', 1);

      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('Назначает обработчик на событие, название которого совпадает со свойством объектов', () => {
      const emitter = new EventEmitter<{ constructor: never }>();
      const listener = vi.fn();

      emitter.addEventListener('constructor', listener);
      emitter.dispatchEvent('constructor');

      expect(listener).toHaveBeenCalledOnce();
    });
  });
});

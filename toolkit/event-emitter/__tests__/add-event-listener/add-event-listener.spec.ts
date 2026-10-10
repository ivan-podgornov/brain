import { describe, expect, it, vi } from 'vitest';

import { EventEmitter } from '../../src/event-emitter';
import { optionsCases, type TestEvents } from '../helpers';

describe('EventEmitter', () => {
  describe('#addEventListener', () => {
    it('Назначает обработчик, который вызывается каждый раз при порождении события', () => {
      const emitter = new EventEmitter<TestEvents>();
      const listener = vi.fn();

      emitter.addEventListener('tick', listener);
      emitter.dispatchEvent('tick');
      emitter.dispatchEvent('tick');
      emitter.dispatchEvent('tick');

      expect(listener).toHaveBeenCalledTimes(3);
    });

    it('Назначает обработчик на событие, название которого совпадает со свойством объектов', () => {
      const emitter = new EventEmitter<{ constructor: never }>();
      const listener = vi.fn();

      emitter.addEventListener('constructor', listener);
      emitter.dispatchEvent('constructor');

      expect(listener).toHaveBeenCalledOnce();
    });

    describe.each(optionsCases)('При назначении с опциями: $name', ({ options }) => {
      it('Вызывает обработчик при порождении события', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('tick', listener, options);

        emitter.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('Вызывает обработчик со значением, переданным вторым параметром', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('update', listener, options);

        emitter.dispatchEvent('update', 5);

        expect(listener).toHaveBeenCalledExactlyOnceWith(5);
      });

      it('Если одну функцию назначили на событие дважды, вызывает её один раз за порождение', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('tick', listener, options);
        emitter.addEventListener('tick', listener, options);

        emitter.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('Если одну функцию назначили на разные события, вызывает её при каждом из них', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('tick', listener, options);
        emitter.addEventListener('update', listener, options);

        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('update', 1);

        expect(listener).toHaveBeenCalledTimes(2);
      });
    });
  });
});

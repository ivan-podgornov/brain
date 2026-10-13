import { describe, expect, it, vi } from 'vitest';

import { EventTarget } from '../../../src/event-target';
import { optionsCases, type TestEvents } from '../helpers';

describe('EventTarget', () => {
  describe('#addEventListener', () => {
    it('Назначает обработчик, который вызывается каждый раз при порождении события', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();

      target.addEventListener('tick', listener);
      target.dispatchEvent('tick');
      target.dispatchEvent('tick');
      target.dispatchEvent('tick');

      expect(listener).toHaveBeenCalledTimes(3);
    });

    it('Назначает обработчик на событие, название которого совпадает со свойством объектов', () => {
      const target = new EventTarget<{ constructor: never }>();
      const listener = vi.fn();

      target.addEventListener('constructor', listener);
      target.dispatchEvent('constructor');

      expect(listener).toHaveBeenCalledOnce();
    });

    describe.each(optionsCases)('При назначении с опциями: $name', ({ options }) => {
      it('Вызывает обработчик при порождении события', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener, options);

        target.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('Вызывает обработчик со значением, переданным вторым параметром', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('update', listener, options);

        target.dispatchEvent('update', 5);

        expect(listener).toHaveBeenCalledExactlyOnceWith(5);
      });

      it('Если одну функцию назначили на событие дважды, вызывает её один раз за порождение', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener, options);
        target.addEventListener('tick', listener, options);

        target.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('Если одну функцию назначили на разные события, вызывает её при каждом из них', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener, options);
        target.addEventListener('update', listener, options);

        target.dispatchEvent('tick');
        target.dispatchEvent('update', 1);

        expect(listener).toHaveBeenCalledTimes(2);
      });
    });
  });
});

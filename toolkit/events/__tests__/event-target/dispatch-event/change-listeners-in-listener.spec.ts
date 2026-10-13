import { describe, expect, it, vi } from 'vitest';

import { EventTarget } from '../../../src/event-target';
import type { TestEvents } from '../helpers';

describe('EventTarget', () => {
  describe('#dispatchEvent', () => {
    describe('Изменение обработчиков во время обработки события', () => {
      it('Если обработчик снят другим обработчиком до своей очереди, он не вызывается', () => {
        const target = new EventTarget<TestEvents>();
        const second = vi.fn();
        target.addEventListener('tick', () => target.removeEventListener('tick', second));
        target.addEventListener('tick', second);

        target.dispatchEvent('tick');

        expect(second).not.toHaveBeenCalled();
      });

      it('Если обработчик снят другим обработчиком до своей очереди, остальные вызываются', () => {
        const target = new EventTarget<TestEvents>();
        const second = vi.fn();
        const third = vi.fn();
        target.addEventListener('tick', () => target.removeEventListener('tick', second));
        target.addEventListener('tick', second);
        target.addEventListener('tick', third);

        target.dispatchEvent('tick');

        expect(third).toHaveBeenCalledOnce();
      });

      it('Если обработчик назначен во время порождения события, в текущем порождении он не вызывается', () => {
        const target = new EventTarget<TestEvents>();
        const late = vi.fn();
        target.addEventListener('tick', () => target.addEventListener('tick', late));

        target.dispatchEvent('tick');

        expect(late).not.toHaveBeenCalled();
      });

      it('Если обработчик назначен во время порождения события, при следующем порождении он вызывается', () => {
        const target = new EventTarget<TestEvents>();
        const late = vi.fn();
        target.addEventListener('tick', () => target.addEventListener('tick', late));

        target.dispatchEvent('tick');
        target.dispatchEvent('tick');

        expect(late).toHaveBeenCalledOnce();
      });

      it('Если событие порождается изнутри обработчика с once: true, он не вызывается повторно', () => {
        const target = new EventTarget<TestEvents>();
        let calls = 0;
        function listener() {
          calls += 1;

          if (calls < 5) {
            target.dispatchEvent('tick');
          }
        }
        target.addEventListener('tick', listener, { once: true });

        target.dispatchEvent('tick');

        expect(calls).toBe(1);
      });
    });
  });
});

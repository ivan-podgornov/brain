import { describe, expect, it, vi } from 'vitest';

import { EventEmitter } from '../../src/event-emitter';
import type { TestEvents } from '../helpers';

describe('EventEmitter', () => {
  describe('#dispatchEvent', () => {
    describe('Изменение обработчиков во время обработки события', () => {
      it('Если обработчик снят другим обработчиком до своей очереди, он не вызывается', () => {
        const emitter = new EventEmitter<TestEvents>();
        const second = vi.fn();
        emitter.addEventListener('tick', () => emitter.removeEventListener('tick', second));
        emitter.addEventListener('tick', second);

        emitter.dispatchEvent('tick');

        expect(second).not.toHaveBeenCalled();
      });

      it('Если обработчик снят другим обработчиком до своей очереди, остальные вызываются', () => {
        const emitter = new EventEmitter<TestEvents>();
        const second = vi.fn();
        const third = vi.fn();
        emitter.addEventListener('tick', () => emitter.removeEventListener('tick', second));
        emitter.addEventListener('tick', second);
        emitter.addEventListener('tick', third);

        emitter.dispatchEvent('tick');

        expect(third).toHaveBeenCalledOnce();
      });

      it('Если обработчик назначен во время порождения события, в текущем порождении он не вызывается', () => {
        const emitter = new EventEmitter<TestEvents>();
        const late = vi.fn();
        emitter.addEventListener('tick', () => emitter.addEventListener('tick', late));

        emitter.dispatchEvent('tick');

        expect(late).not.toHaveBeenCalled();
      });

      it('Если обработчик назначен во время порождения события, при следующем порождении он вызывается', () => {
        const emitter = new EventEmitter<TestEvents>();
        const late = vi.fn();
        emitter.addEventListener('tick', () => emitter.addEventListener('tick', late));

        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('tick');

        expect(late).toHaveBeenCalledOnce();
      });

      it('Если событие порождается изнутри обработчика с once: true, он не вызывается повторно', () => {
        const emitter = new EventEmitter<TestEvents>();
        let calls = 0;
        function listener() {
          calls += 1;

          if (calls < 5) {
            emitter.dispatchEvent('tick');
          }
        }
        emitter.addEventListener('tick', listener, { once: true });

        emitter.dispatchEvent('tick');

        expect(calls).toBe(1);
      });
    });
  });
});

import { describe, expect, it, vi } from 'vitest';

import { EventTarget } from '../../../src/event-target';
import type { TestEvents } from '../helpers';

describe('EventTarget', () => {
  describe('#addEventListener', () => {
    describe('С опцией once: true', () => {
      it('Вызывает обработчик только один раз, сколько бы раз ни порождалось событие', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener, { once: true });

        target.dispatchEvent('tick');
        target.dispatchEvent('tick');
        target.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('Если обработчик выбросил исключение, он всё равно снимается', () => {
        const target = new EventTarget<TestEvents>({ onError: vi.fn() });
        const listener = vi.fn(() => {
          throw new Error('boom');
        });
        target.addEventListener('tick', listener, { once: true });

        target.dispatchEvent('tick');
        target.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('После срабатывания остальные обработчики события продолжают вызываться', () => {
        const target = new EventTarget<TestEvents>();
        const regular = vi.fn();
        target.addEventListener('tick', vi.fn(), { once: true });
        target.addEventListener('tick', regular);

        target.dispatchEvent('tick');
        target.dispatchEvent('tick');

        expect(regular).toHaveBeenCalledTimes(2);
      });

      it('Если назначить обработчик заново после срабатывания, он сработает ещё раз', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener, { once: true });
        target.dispatchEvent('tick');

        target.addEventListener('tick', listener, { once: true });
        target.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledTimes(2);
      });
    });

    describe('Если один и тот же обработчик назначен с once и без него', () => {
      it('Если сначала назначен без once, затем с once, он остаётся обычным и вызывается при каждом порождении', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener);
        target.addEventListener('tick', listener, { once: true });

        target.dispatchEvent('tick');
        target.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledTimes(2);
      });

      it('Если сначала назначен с once, затем без него, он остаётся одноразовым', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener, { once: true });
        target.addEventListener('tick', listener);

        target.dispatchEvent('tick');
        target.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('Один вызов removeEventListener снимает обработчик полностью', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener);
        target.addEventListener('tick', listener, { once: true });

        target.removeEventListener('tick', listener);
        target.dispatchEvent('tick');

        expect(listener).not.toHaveBeenCalled();
      });

      it('Если сработавший как once обработчик назначить без once, дальше он вызывается при каждом порождении', () => {
        const target = new EventTarget<TestEvents>();
        const listener = vi.fn();
        target.addEventListener('tick', listener, { once: true });
        target.dispatchEvent('tick');

        target.addEventListener('tick', listener);
        target.dispatchEvent('tick');
        target.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledTimes(3);
      });
    });
  });
});

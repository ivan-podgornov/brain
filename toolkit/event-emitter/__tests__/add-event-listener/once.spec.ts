import { describe, expect, it, vi } from 'vitest';

import { EventEmitter } from '../../src/event-emitter';
import type { TestEvents } from '../helpers';

describe('EventEmitter', () => {
  describe('#addEventListener', () => {
    describe('С опцией once: true', () => {
      it('Вызывает обработчик только один раз, сколько бы раз ни порождалось событие', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('tick', listener, { once: true });

        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('Если обработчик выбросил исключение, он всё равно снимается', () => {
        const emitter = new EventEmitter<TestEvents>({ onError: vi.fn() });
        const listener = vi.fn(() => {
          throw new Error('boom');
        });
        emitter.addEventListener('tick', listener, { once: true });

        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('После срабатывания остальные обработчики события продолжают вызываться', () => {
        const emitter = new EventEmitter<TestEvents>();
        const regular = vi.fn();
        emitter.addEventListener('tick', vi.fn(), { once: true });
        emitter.addEventListener('tick', regular);

        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('tick');

        expect(regular).toHaveBeenCalledTimes(2);
      });

      it('Если назначить обработчик заново после срабатывания, он сработает ещё раз', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('tick', listener, { once: true });
        emitter.dispatchEvent('tick');

        emitter.addEventListener('tick', listener, { once: true });
        emitter.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledTimes(2);
      });
    });

    describe('Если один и тот же обработчик назначен с once и без него', () => {
      it('Если сначала назначен без once, затем с once, он остаётся обычным и вызывается при каждом порождении', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('tick', listener);
        emitter.addEventListener('tick', listener, { once: true });

        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledTimes(2);
      });

      it('Если сначала назначен с once, затем без него, он остаётся одноразовым', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('tick', listener, { once: true });
        emitter.addEventListener('tick', listener);

        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledOnce();
      });

      it('Один вызов removeEventListener снимает обработчик полностью', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('tick', listener);
        emitter.addEventListener('tick', listener, { once: true });

        emitter.removeEventListener('tick', listener);
        emitter.dispatchEvent('tick');

        expect(listener).not.toHaveBeenCalled();
      });

      it('Если сработавший как once обработчик назначить без once, дальше он вызывается при каждом порождении', () => {
        const emitter = new EventEmitter<TestEvents>();
        const listener = vi.fn();
        emitter.addEventListener('tick', listener, { once: true });
        emitter.dispatchEvent('tick');

        emitter.addEventListener('tick', listener);
        emitter.dispatchEvent('tick');
        emitter.dispatchEvent('tick');

        expect(listener).toHaveBeenCalledTimes(3);
      });
    });
  });
});

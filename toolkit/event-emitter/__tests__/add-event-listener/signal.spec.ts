import { describe, expect, it, vi } from 'vitest';

import { EventEmitter } from '../../src/event-emitter';
import { createMockedAbortSignal, type TestEvents } from '../helpers';

describe('EventEmitter', () => {
  describe('С опцией signal', () => {
    it('Если сигнал изначально в состоянии aborted, то обработчик указанного события не вызывается', () => {
      const emitter = new EventEmitter<TestEvents>();
      const listener = vi.fn();
      const signal = createMockedAbortSignal(true);
      emitter.addEventListener('tick', listener, { signal });

      emitter.dispatchEvent('tick');

      expect(listener).not.toHaveBeenCalled();
    });

    it('Если сигнал в состоянии pending, то обработчик указанного события вызывается', () => {
      const emitter = new EventEmitter<TestEvents>();
      const listener = vi.fn();
      const signal = createMockedAbortSignal(false);
      emitter.addEventListener('tick', listener, { signal });

      emitter.dispatchEvent('tick');

      expect(listener).toHaveBeenCalled();
    });

    it('Если сигнал изначально был в состоянии pending, но в процессе стал aborted, событие перестаёт вызываться', () => {
      const emitter = new EventEmitter<TestEvents>();
      const listener = vi.fn();
      const signal = createMockedAbortSignal(false);

      emitter.addEventListener('tick', listener, { signal });
      emitter.dispatchEvent('tick');
      signal.dispatchEvent('abort', 'reason');
      emitter.dispatchEvent('tick');

      expect(listener).toHaveBeenCalledOnce();
    });
  });
});

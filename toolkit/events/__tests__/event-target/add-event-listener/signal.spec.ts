import { describe, expect, it, vi } from 'vitest';

import { EventTarget } from '../../../src/event-target';
import { createMockedAbortSignal, type TestEvents } from '../helpers';

describe('EventTarget', () => {
  describe('С опцией signal', () => {
    it('Если сигнал изначально в состоянии aborted, то обработчик указанного события не вызывается', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();
      const signal = createMockedAbortSignal(true);
      target.addEventListener('tick', listener, { signal });

      target.dispatchEvent('tick');

      expect(listener).not.toHaveBeenCalled();
    });

    it('Если сигнал в состоянии pending, то обработчик указанного события вызывается', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();
      const signal = createMockedAbortSignal(false);
      target.addEventListener('tick', listener, { signal });

      target.dispatchEvent('tick');

      expect(listener).toHaveBeenCalled();
    });

    it('Если сигнал изначально был в состоянии pending, но в процессе стал aborted, событие перестаёт вызываться', () => {
      const target = new EventTarget<TestEvents>();
      const listener = vi.fn();
      const signal = createMockedAbortSignal(false);

      target.addEventListener('tick', listener, { signal });
      target.dispatchEvent('tick');
      signal.dispatchEvent('abort', 'reason');
      target.dispatchEvent('tick');

      expect(listener).toHaveBeenCalledOnce();
    });
  });
});

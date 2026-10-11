import { describe, expect, it } from 'vitest';

import { AbortController } from '../../src/abort-controller';

describe('AbortController', () => {
  describe('#signal', () => {
    it('При создании контроллера, сигнал находится в состоянии pending', () => {
      const controller = new AbortController();

      expect(controller.signal.aborted).toBe(false);
    });

    it('После вызова controller.abort, переходит в состояние aborted', () => {
      const controller = new AbortController();

      controller.abort();

      expect(controller.signal.aborted).toBe(true);
    });

    it('При переходе из состояния pending в aborted, указывает на тот же экземпляр AbortSignal', () => {
      const controller = new AbortController();
      const signal = controller.signal;

      controller.abort();

      expect(controller.signal).toBe(signal);
    });
  });
});

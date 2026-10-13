import { describe, expect, it } from 'vitest';

import { AbortSignal } from '../../src/abort-signal';

import { alwaysPendingSignalExecutor } from './helpers';

describe('AbortSignal', () => {
  describe('При состоянии pending', () => {
    describe('#aborted', () => {
      it('Равно значению false', () => {
        const signal = new AbortSignal(alwaysPendingSignalExecutor());

        expect(signal.aborted).toBe(false);
      });
    });

    describe('#reason', () => {
      it('Равно значению undefined', () => {
        const signal = new AbortSignal(alwaysPendingSignalExecutor());

        expect(signal.reason).toBeUndefined();
      });
    });

    describe('#throwIfAborted', () => {
      it('Не выбрасывает reason при вызове', () => {
        const signal = new AbortSignal(alwaysPendingSignalExecutor());

        expect(() => signal.throwIfAborted()).not.toThrow();
      });
    });
  });
});

import { describe, expect, it } from 'vitest';

import { AbortSignal } from '../../src/abort-signal';
import { immediatelyAbortedSignalExecutor } from '../helpers';

describe('AbortSignal', () => {
  describe('При состоянии aborted', () => {
    describe('#aborted', () => {
      it('Равно значению true', () => {
        const signal = new AbortSignal(immediatelyAbortedSignalExecutor());

        expect(signal.aborted).toBe(true);
      });
    });

    describe('#reason', () => {
      it('Если при переводе в состояние aborted, была указана причина, свойство reason = указанной причине', () => {
        const reason = new Error('some reason');
        const signal = new AbortSignal(immediatelyAbortedSignalExecutor(reason));

        expect(signal.reason).toStrictEqual(reason);
      });

      it('Если при переводе в состояние aborted, причина не указывалась, свойство reason = AbortError', () => {
        const signal = new AbortSignal(immediatelyAbortedSignalExecutor());

        expect(signal.reason).toHaveProperty('name', 'AbortError');
        expect(signal.reason).toBeInstanceOf(Error);
      });
    });

    describe('#throwIfAborted', () => {
      it('Выбрасывает reason', () => {
        const reason = new Error('some reason');
        const signal = new AbortSignal(immediatelyAbortedSignalExecutor(reason));

        expect(() => signal.throwIfAborted()).toThrow(reason);
      });
    });
  });
});

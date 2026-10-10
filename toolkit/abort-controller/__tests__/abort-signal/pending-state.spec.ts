import { describe, it } from 'vitest';

describe('AbortSignal', () => {
  describe('При состоянии pending', () => {
    describe('#aborted', () => {
      it.todo('Равно значению false');
    });

    describe('#reason', () => {
      it.todo('Равно значению undefined');
    });

    describe('#throwIfAborted', () => {
      it.todo('Не выбрасывает reason при вызове');
    });
  });
});

import { describe, it } from 'vitest';

describe('AbortSignal', () => {
  describe('При состоянии aborted', () => {
    describe('#aborted', () => {
      it.todo('Равно значению true');
    });

    describe('#reason', () => {
      it.todo(
        'Если при переводе в состояние aborted, была указана причина, свойство reason = указанной причине'
      );

      it.todo(
        'Если при переводе в состояние aborted, причина не указывалась, свойство reason = AbortError'
      );
    });

    describe('#throwIfAborted', () => {
      it.todo('Выбрасывает reason');
    });
  });
});

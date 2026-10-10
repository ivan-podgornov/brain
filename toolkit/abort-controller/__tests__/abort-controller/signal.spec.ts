import { describe, it } from 'vitest';

describe('AbortController', () => {
  describe('#signal', () => {
    it.todo('При создании контроллера, сигнал находится в состоянии pending');

    it.todo('После вызова controller.abort, переходит в состояние aborted');

    it.todo(
      'При переходе из состояния pending в aborted, указывает на тот же экземпляр AbortSignal'
    );
  });
});

import { describe, it } from 'vitest';

describe('AbortSignal.timeout', () => {
  it.todo('Возвращает сигнал, который изначально в состоянии pending');

  it.todo('Сигнал в состоянии pending до истечения таймаута');

  it.todo(
    'Возвращает сигнал, который по истечению таймаута укзанного в параметре метода переходит в состояние aborted'
  );

  it.todo('Причиной перехода сигнала в состояние aborted, является TimeoutError');
});

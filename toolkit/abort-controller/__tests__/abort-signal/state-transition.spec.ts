import { describe, it } from 'vitest';

const abortEventHandlingVariants = [
  { name: 'обработчик назначенный с помощью addEventListener', variant: 'addEventListener' },
  { name: 'обработчик назначенный с помощью onabort', variant: 'onAbort' },
] as const;

describe('AbortSignal', () => {
  describe('Переход в состояние aborted', () => {
    it.each(abortEventHandlingVariants)('aborted выставляется в true до того как вызовется $name');

    it.each(abortEventHandlingVariants)('reason указывается до того как вызовется $name');

    it.each(abortEventHandlingVariants)('При переходе в aborted, вызывается $name', () => {});

    it.todo(
      'При переходе в aborted, значение свойства aborted, меняется с false на true',
      () => {}
    );

    it.each(abortEventHandlingVariants)(
      'При повторной попытке перейти в aborted, $name не вызывается',
      () => {}
    );

    it.each(abortEventHandlingVariants)(
      'Если при переходе в состояние aborted указывалась причина, она передаётся в $name',
      () => {}
    );

    it.each(abortEventHandlingVariants)(
      'Если при переходе в состояние aborted причина не указывалась, в $name, передаётся AbortError',
      () => {}
    );

    it.each(abortEventHandlingVariants)(
      'Если задиспатчить событие abort на экземпляре сигнала, срабатывает $name',
      () => {}
    );

    it.todo(
      'Если задиспатчить событие abort на экземпляре сигнала, сигнал не переходит в состояние aborted'
    );

    it.todo('Если вызвать onabort на экземпляре сигнала, сигнал не переходит в состояние aborted');
  });
});

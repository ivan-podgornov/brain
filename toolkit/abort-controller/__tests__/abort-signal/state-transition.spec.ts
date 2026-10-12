import { describe, expect, it, vi } from 'vitest';

import { AbortController } from '../../src/abort-controller';
import { listenAbortEvent } from '../helpers';

const abortEventHandlingVariants = [
  { name: 'обработчик назначенный с помощью addEventListener', variant: 'addEventListener' },
  { name: 'обработчик назначенный с помощью onabort', variant: 'onabort' },
] as const;

describe('AbortSignal', () => {
  describe('Переход в состояние aborted', () => {
    it.each(abortEventHandlingVariants)(
      'aborted выставляется в true до того как вызовется $name',
      ({ variant }) => {
        const controller = new AbortController();
        const listener = vi.fn().mockImplementation(() => controller.signal.aborted);
        listenAbortEvent(controller.signal, variant, listener);

        controller.abort();

        expect(listener).toHaveReturnedWith(true);
      }
    );

    it.each(abortEventHandlingVariants)(
      'reason указывается до того как вызовется $name',
      ({ variant }) => {
        const reason = new Error('Потому что потому');
        const controller = new AbortController();
        const listener = vi.fn().mockImplementation(() => controller.signal.reason);
        listenAbortEvent(controller.signal, variant, listener);

        controller.abort(reason);

        expect(listener).toHaveReturnedWith(reason);
      }
    );

    it.each(abortEventHandlingVariants)(
      'При переходе в aborted, вызывается $name',
      ({ variant }) => {
        const controller = new AbortController();
        const listener = vi.fn();
        listenAbortEvent(controller.signal, variant, listener);

        controller.abort();

        expect(listener).toHaveBeenCalledOnce();
      }
    );

    it('При переходе в aborted, значение свойства aborted, меняется с false на true', () => {
      const controller = new AbortController();

      controller.abort();

      expect(controller.signal.aborted).toBe(true);
    });

    it.each(abortEventHandlingVariants)(
      'При повторной попытке перейти в состояние aborted, $name не вызывается',
      ({ variant }) => {
        const controller = new AbortController();
        const listener = vi.fn();
        listenAbortEvent(controller.signal, variant, listener);

        controller.abort();
        controller.abort();

        expect(listener).toHaveBeenCalledOnce();
      }
    );

    it.each(abortEventHandlingVariants)(
      'Если при переходе в состояние aborted указывалась причина, она передаётся в $name',
      ({ variant }) => {
        const reason = new Error('Потому что потому');
        const controller = new AbortController();
        const listener = vi.fn();
        listenAbortEvent(controller.signal, variant, listener);

        controller.abort(reason);

        expect(listener).toHaveBeenCalledWith(reason);
      }
    );

    it.each(abortEventHandlingVariants)(
      'Если при переходе в состояние aborted причина не указывалась, в $name, передаётся AbortError',
      ({ variant }) => {
        const controller = new AbortController();
        const listener = vi.fn();
        listenAbortEvent(controller.signal, variant, listener);

        controller.abort();

        expect(listener).toHaveBeenCalledWith(expect.objectContaining({ name: 'AbortError' }));
      }
    );

    it.each(abortEventHandlingVariants)(
      'Если задиспатчить событие abort на экземпляре сигнала, срабатывает $name',
      ({ variant }) => {
        const controller = new AbortController();
        const listener = vi.fn();
        listenAbortEvent(controller.signal, variant, listener);

        controller.signal.dispatchEvent('abort', new Error());

        expect(listener).toHaveBeenCalled();
      }
    );

    it('Если задиспатчить событие abort на экземпляре сигнала, сигнал не переходит в состояние aborted', () => {
      const controller = new AbortController();

      controller.signal.dispatchEvent('abort', new Error());

      expect(controller.signal.aborted).toBe(false);
    });

    it('Если вызвать onabort на экземпляре сигнала, сигнал не переходит в состояние aborted', () => {
      const controller = new AbortController();
      controller.signal.onabort = () => {};

      // Вызывать обработчик, который мы сами навесили и проверять его работу - это немного странно,
      // но, теоретически, onabort мог быть сеттером, который привносил себе побочный эффект в виде
      // перевода сигнала в состояние aborted.
      controller.signal.onabort(new Error());

      expect(controller.signal.aborted).toBe(false);
    });
  });
});

import { AbortSignal } from '../src/abort-signal';
import type { AbortListener, AbortSignalExecutor } from '../src/types';

/**
 * Возвращает executor сигнала, который сразу переводит сигнал в состояние aborted
 * @param reason - причина по которой сигнал перейдёт в состояние aborted
 */
export function immediatelyAbortedSignalExecutor(reason?: unknown): AbortSignalExecutor {
  return (abort) => abort(reason);
}

/**
 * Возвращает executor сигнала, который вечно держит сигнал в состоянии pending
 */
export function alwaysPendingSignalExecutor(): AbortSignalExecutor {
  return () => {};
}

/**
 * Навешивает на сигнал обработчик события. Есть два способа навесить обработчик:
 * 1. С помощью addEventListener
 * 2. С помощью задания значения для свойства onabort
 * @param signal - сигнал на который нужно навесить обработчик
 * @param variant - способ обработки события
 * @param listener - слушатель события
 */
export function listenAbortEvent(
  signal: AbortSignal,
  variant: 'addEventListener' | 'onabort',
  listener: AbortListener
) {
  if (variant === 'addEventListener') {
    signal.addEventListener('abort', listener);
  } else if (variant === 'onabort') {
    signal.onabort = listener;
  }
}

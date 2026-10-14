import { EventTarget } from '../event-target';

import { AbortedState } from './states/aborted';
import { PendingState } from './states/pending';

import type {
  AbortListener,
  AbortSignalExecutor,
  AbortSignalEvents,
  IAbortSignal,
  IAbortSignalState,
} from './types';

export class AbortSignal extends EventTarget<AbortSignalEvents> implements IAbortSignal {
  private state: IAbortSignalState;

  /** Используется в качестве обработчика события abort. Вызывается, при переходе в состояние aborted */
  onabort: AbortListener | null;

  constructor(executor: AbortSignalExecutor) {
    super();
    this.state = new PendingState();
    this.onabort = null;
    executor(this.toAbort.bind(this));

    this.addEventListener('abort', (reason) => {
      if (this.onabort) {
        this.onabort(reason);
      }
    });
  }

  /**
   * Возвращает true, если сигнал в состоянии aborted.
   * Возвращает false, если сигнал в состоянии pending.
   */
  get aborted() {
    return this.state.aborted;
  }

  /**
   * Возвращает причину перевода сигнала в состояние aborted
   * Если сигнал в состоянии pending, возвращает undefined
   */
  get reason() {
    return this.state.reason;
  }

  /** Выбрасывает reason, если сигнал в состоянии aborted */
  throwIfAborted(): void {
    this.state.throwIfAborted();
  }

  private toAbort(reason?: unknown) {
    if (this.aborted) {
      return;
    }

    const computedReason = typeof reason === 'undefined' ? this.getDefaultReason() : reason;
    this.state = new AbortedState(computedReason);
    this.dispatchEvent('abort', computedReason);
  }

  private getDefaultReason() {
    const defaultReason = new Error('signal is aborted without reason');
    defaultReason.name = 'AbortError';
    return defaultReason;
  }

  /**
   * Возвращает сигнал, который изначально в состоянии aborted
   * @param reason - причина перехода в состояние aborted
   */
  static abort(reason?: unknown): IAbortSignal {
    return new AbortSignal((abort) => abort(reason));
  }

  /**
   * Возвращает сигнал, который изначально в состоянии pending и переходит в состояние aborted,
   * если хотя бы один из сигналов переходит в это состояние или изначально был в нём.
   * @param signals - список сигналов за которыми нужно следить
   */
  static any(signals: Array<IAbortSignal>): IAbortSignal {
    const abortedSignal = signals.find((signal) => signal.aborted);

    if (abortedSignal) {
      return AbortSignal.abort(abortedSignal.reason);
    }

    return new AbortSignal((abort) => {
      signals.forEach((signal) => {
        signal.addEventListener(
          'abort',
          function listener(reason: unknown) {
            signals.forEach((signal) => signal.removeEventListener('abort', listener));
            abort(reason);
          },
          { once: true }
        );
      });
    });
  }

  /**
   * Возвращает сигнал, который изначально в состоянии pending и переходит в состояние aborted,
   * когда пройдёт таймаут, указанный в параметре.
   * @param ms - количество миллисекунд, через которое сигнал перейдет в состояние aborted
   */
  static timeout(ms: number): IAbortSignal {
    const reason = new Error('signal timed out');
    reason.name = 'TimeoutError';

    // @ts-expect-error -- ожидаем, что таймаут объявлен в глобальной области видимости
    return new AbortSignal((abort) => setTimeout(abort, ms, reason));
  }
}

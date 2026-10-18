import { AbortController } from '../abort-controller';
import type { IAbortSignal } from '../abort-signal';
import { EventTarget } from '../event-target';
import type { IEventTarget, ListenerOptions } from '../event-target';
import { normalizeObserver } from '../subscriber';
import type { IObserver, IObserverObject, ObserveOptions } from '../subscriber';

type ErrorHandler = (error?: unknown) => void;

export type MulticastOptions = {
  onError?: ErrorHandler;
};

type ObserverEvents<T> = {
  complete: [];
  next: [value: T];
  error: [error?: unknown];
};

export class MulticastObserver<T> implements IObserverObject<T> {
  private readonly abortController: AbortController;
  private readonly onError: ErrorHandler;
  private readonly eventTarget: IEventTarget<ObserverEvents<T>>;
  private observersCount: number;

  constructor(options: MulticastOptions = {}) {
    this.abortController = new AbortController();
    this.onError = options.onError ?? (() => {});
    this.eventTarget = new EventTarget<ObserverEvents<T>>({ onError: this.onError });
    this.observersCount = 0;
  }

  get signal() {
    return this.abortController.signal;
  }

  /**
   * Добавляет observer в multicast. Если сигнал переданный в опциях перейдёт в состояние aborted,
   * такой observer будет удалён из вещания
   * @param observer - наблюдатель, которого нужно добавить в multicast
   * @param options - параметры наблюдения
   */
  add(observer?: IObserver<T>, options: ObserveOptions = {}) {
    const normalizedObserver = normalizeObserver({ onError: this.onError }, observer);
    const signal = options.signal ?? new AbortController().signal;
    const listenerOptions: ListenerOptions = { signal };

    this.observersCount += 1;

    if (signal.aborted) {
      this.onSignalAborted(signal);
      return;
    }

    signal.addEventListener('abort', () => this.onSignalAborted(signal), { once: true });

    this.eventTarget.addEventListener(
      'next',
      normalizedObserver.next.bind(normalizedObserver),
      listenerOptions
    );

    this.eventTarget.addEventListener(
      'complete',
      normalizedObserver.complete.bind(normalizedObserver),
      listenerOptions
    );

    this.eventTarget.addEventListener(
      'error',
      normalizedObserver.error.bind(normalizedObserver),
      listenerOptions
    );
  }

  error(error?: unknown) {
    this.eventTarget.dispatchEvent('error', error);
  }

  complete() {
    this.eventTarget.dispatchEvent('complete');
  }

  next(value: T) {
    this.eventTarget.dispatchEvent('next', value);
  }

  private onSignalAborted(signal: IAbortSignal) {
    this.observersCount -= 1;

    if (this.observersCount === 0) {
      this.abortController.abort(signal.reason);
    }
  }
}

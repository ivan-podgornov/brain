import { AbortController } from '../abort-controller';
import { AbortSignal, type IAbortSignal } from '../abort-signal';
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
    this.observersCount += 1;
    const normalizedObserver = normalizeObserver({ onError: this.onError }, observer);

    const signals: IAbortSignal[] = [this.signal];

    if (options.signal) {
      const { signal } = options;
      signals.push(signal);
      signal.addEventListener('abort', () => this.onSignalAborted(signal), {
        once: true,
        signal: this.signal,
      });

      if (signal.aborted) {
        this.onSignalAborted(signal);
      }
    }

    const listenerOptions: ListenerOptions = { signal: AbortSignal.any(signals) };

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
    this.abortController.abort('subscriber failed');
  }

  complete() {
    this.eventTarget.dispatchEvent('complete');
    this.abortController.abort('subscriber success');
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

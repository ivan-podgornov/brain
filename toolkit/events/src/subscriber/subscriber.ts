import { AbortController } from '../abort-controller';
import type { IAbortSignal } from '../abort-signal';

import type { ISubscriber, IObserver, TeardownCallback, IObserverObject } from './types';

export type SubscriberConstructorOptions = {
  signal?: IAbortSignal;
  onError?: (error?: unknown) => void;
};

type NormalizedObserver<T> = Required<IObserverObject<T>>;
type CallObserver = () => void;

function noop() {}

export class Subscriber<T> implements ISubscriber<T> {
  readonly signal: IAbortSignal;

  private readonly observer: NormalizedObserver<T>;
  private readonly abortController: AbortController;
  private readonly teardowns: TeardownCallback[];
  private readonly onError: (error?: unknown) => void;

  constructor(observer?: IObserver<T>, options: SubscriberConstructorOptions = {}) {
    this.onError = options.onError ?? noop;
    this.observer = this.nornalizeObserver(observer);
    this.abortController = new AbortController();
    this.teardowns = [];
    this.signal = this.abortController.signal;

    if (options.signal) {
      this.listenOuterSignal(options.signal);
    }
  }

  get active() {
    return !this.signal.aborted;
  }

  addTeardown(teardown: TeardownCallback): void {
    if (this.active) {
      this.teardowns.push(teardown);
    } else {
      this.callOneTeardown(teardown);
    }
  }

  complete(): void {
    this.deactivate(() => this.observer.complete());
  }

  error(error?: unknown): void {
    this.deactivate(() => this.observer.error(error), error);
  }

  next(value: T): void {
    if (!this.active) {
      return;
    }

    try {
      this.observer.next(value);
    } catch (error) {
      this.onError(error);
    }
  }

  /** Приводит переданный observer к одному формату, когда observer является объектом со всеми методами */
  private nornalizeObserver(observer?: IObserver<T>): NormalizedObserver<T> {
    const defaultObserver: NormalizedObserver<T> = {
      next: noop,
      error: this.onError.bind(this),
      complete: noop,
    };

    if (!observer) {
      return defaultObserver;
    }

    if (typeof observer === 'function') {
      return { ...defaultObserver, next: observer };
    }

    return { ...defaultObserver, ...observer };
  }

  /**
   * Прослушивает сигнал который пришел в опциях и если он перешел в состояние aborted, деактивирует подписку
   */
  private listenOuterSignal(signal: IAbortSignal) {
    if (signal.aborted) {
      this.abortController.abort(signal.reason);
    }

    signal.addEventListener('abort', (reason) => this.deactivate(noop, reason), { once: true });
  }

  /** Деактивирует подписку */
  private deactivate(callObserver?: CallObserver, reason?: unknown) {
    if (!this.active) {
      return;
    }

    this.abortController.abort(reason);
    this.callRegisteredTeardowns();

    if (callObserver) {
      try {
        callObserver();
      } catch (error) {
        this.onError(error);
      }
    }
  }

  /** Вызывает все зарегистрированные teardown-колбэки */
  private callRegisteredTeardowns() {
    this.teardowns.toReversed().forEach(this.callOneTeardown.bind(this));
  }

  /** Вызывает один конкретный teardown-колбэк */
  private callOneTeardown(teardown: TeardownCallback) {
    try {
      teardown();
    } catch (error) {
      this.onError(error);
    }
  }
}

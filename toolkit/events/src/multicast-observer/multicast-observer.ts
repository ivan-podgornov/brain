import { AbortController } from '../abort-controller';
import type { IObserver, IObserverObject, ObserveOptions } from '../subscriber';

export type MulticastOptions = {
  onError?: (error?: unknown) => void;
};

export class MulticastObserver<T> implements IObserverObject<T> {
  private abortController: AbortController;

  constructor(_options: MulticastOptions = {}) {
    this.abortController = new AbortController();
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
  add(_observer?: IObserver<T>, _options?: ObserveOptions) {}

  error(_error?: unknown) {}

  complete() {}

  next(_value: T) {}
}

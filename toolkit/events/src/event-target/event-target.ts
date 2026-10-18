import { Listeners } from './listeners';
import type { EventMap, IEventTarget, Listener, ListenerOptions } from './types';

type ErrorHandler = (error: unknown) => void;

export type EventTargetOptions = {
  onError?: ErrorHandler;
};

const DEFAULT_LISTENER_OPTIONS: ListenerOptions = {
  once: false,
};

export class EventTarget<Events extends EventMap<Events>> implements IEventTarget<Events> {
  private readonly listeners: Listeners<Events> = new Listeners();
  private readonly onError: ErrorHandler;

  constructor(options: EventTargetOptions = {}) {
    this.onError = options.onError ?? (() => {});
  }

  dispatchEvent<K extends keyof Events>(type: K, ...payload: Events[K]): void {
    this.listeners.forEach(type, (listener, options) => {
      try {
        if (options.once) {
          this.removeEventListener(type, listener);
        }

        listener(...payload);
      } catch (error) {
        try {
          this.onError(error);
        } catch {
          // должен быть пустым. Кто хотел ошибку обработать, тот обработает в onError
        }
      }
    });
  }

  addEventListener<K extends keyof Events>(
    type: K,
    listener: Listener<Events[K]>,
    options: ListenerOptions = DEFAULT_LISTENER_OPTIONS
  ): void {
    if (options.signal) {
      if (options.signal.aborted) {
        return;
      }

      options.signal.addEventListener('abort', () => this.removeEventListener(type, listener), {
        once: true,
      });
    }

    this.listeners.add(type, listener, { ...DEFAULT_LISTENER_OPTIONS, ...options });
  }

  removeEventListener<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void {
    this.listeners.delete(type, listener);
  }
}

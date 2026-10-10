import { Listeners } from './listeners';
import type {
  DefaultEvents,
  EventPayload,
  IEventEmitter,
  Listener,
  ListenerOptions,
} from './types';

type ErrorHandler = (error: unknown) => void;

export type EventEmitterOptions = {
  onError?: ErrorHandler;
};

const DEFAULT_LISTENER_OPTIONS: ListenerOptions = {
  once: false,
};

export class EventEmitter<Events extends DefaultEvents> implements IEventEmitter<Events> {
  private readonly listeners: Listeners<Events> = new Listeners();
  private readonly onError: ErrorHandler;

  constructor(options: EventEmitterOptions = {}) {
    this.onError = options.onError ?? (() => {});
  }

  dispatchEvent<K extends keyof Events>(type: K, ...payload: EventPayload<Events[K]>): void {
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
    this.listeners.add(type, listener, { ...DEFAULT_LISTENER_OPTIONS, ...options });
  }

  removeEventListener<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void {
    this.listeners.delete(type, listener);
  }
}

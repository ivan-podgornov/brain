import { Listeners } from './listeners';
import type { DefaultEventsRecord, EventPayload, IEventEmitter, Listener } from './types';

type ErrorHandler = (error: unknown) => void;

export type EventEmitterOptions = {
  onError?: ErrorHandler;
};

export class EventEmitter<Events extends DefaultEventsRecord> implements IEventEmitter<Events> {
  private readonly listeners: Listeners<Events> = new Listeners();
  private readonly onError: ErrorHandler;

  constructor(options: EventEmitterOptions = {}) {
    this.onError = options.onError ?? (() => {});
  }

  dispatchEvent<K extends keyof Events>(type: K, ...payload: EventPayload<Events[K]>): void {
    this.listeners.forEach(type, (listener) => {
      try {
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

  addEventListener<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void {
    this.listeners.add(type, listener);
  }

  removeEventListener<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void {
    this.listeners.delete(type, listener);
  }
}

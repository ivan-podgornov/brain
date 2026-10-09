import type { DefaultEventsRecord, EventPayload, IEventEmitter, Listener } from './types';

export type ListenersRecord<Events extends DefaultEventsRecord> = {
  [K in keyof Events]?: Set<Listener<Events[K]>>;
};

export class EventEmitter<Events extends DefaultEventsRecord> implements IEventEmitter<Events> {
  private readonly listenersRecord: ListenersRecord<Events> = {};

  dispatchEvent<K extends keyof Events>(type: K, ...payload: EventPayload<Events[K]>): void {
    const listeners = this.listeners(type);
    listeners.forEach((listener) => listener(...payload));
  }

  addEventListener<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void {
    const listeners = this.listeners(type);

    if (listeners.has(listener)) {
      return;
    }

    listeners.add(listener);
    this.updateListeners(type, listeners);
  }

  removeEventListener<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void {
    const listeners = this.listeners(type);

    if (!listeners.has(listener)) {
      return;
    }

    listeners.delete(listener);
    this.updateListeners(type, listeners);
  }

  /**
   * Возвращает сет обработчиков определённого события. Если у события нет ни одного
   * обработчика, вернёт пустой сет
   */
  private listeners<K extends keyof Events>(type: K): Set<Listener<Events[K]>> {
    return this.listenersRecord[type] ?? new Set();
  }

  /**
   * Обновляет сет обработчиков события
   * @param type - название события для которого нужно обновить обработчиов
   * @param listeners - новые обработчики
   */
  private updateListeners<K extends keyof Events>(type: K, listeners: Set<Listener<Events[K]>>) {
    this.listenersRecord[type] = listeners;
  }
}

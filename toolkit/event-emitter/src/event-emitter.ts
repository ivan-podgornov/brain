import { Listeners } from './listeners';
import type { DefaultEventsRecord, EventPayload, IEventEmitter, Listener } from './types';

export class EventEmitter<Events extends DefaultEventsRecord> implements IEventEmitter<Events> {
  private readonly listeners: Listeners<Events> = new Listeners();

  dispatchEvent<K extends keyof Events>(type: K, ...payload: EventPayload<Events[K]>): void {
    this.listeners.forEach(type, (listener) => {
      listener(...payload);
    });
  }

  addEventListener<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void {
    this.listeners.add(type, listener);
  }

  removeEventListener<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void {
    this.listeners.delete(type, listener);
  }
}

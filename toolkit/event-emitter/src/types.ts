export type DefaultEvents = object;

export type EventPayload<T> = [T] extends [undefined] ? [] : [payload: T];

export type Listener<T> = (...payload: EventPayload<T>) => void;

export type ListenerOptions = {
  /**
   * Если true, обработчик сработает только раз и будет удалён
   * @default false
   */
  once?: boolean;
};

export interface IEventEmitter<Events extends DefaultEvents> {
  /**
   * Генерирует событие на объекте-эмиттере
   * @param type - название события
   * @param payload - параметры события
   */
  dispatchEvent<K extends keyof Events>(type: K, ...payload: EventPayload<Events[K]>): void;

  /**
   * Назначает обработчик на объект-эмиттер. Обработчик будет вызываться при генерации события
   * @param type - название события на которое должен реагировать обработчик
   * @param listener - обработчик (вызывается с теми параметрами с которыми порождается событие)
   */
  addEventListener<K extends keyof Events>(
    type: K,
    listener: Listener<Events[K]>,
    options?: ListenerOptions
  ): void;

  /**
   * Снимает обработчик с объекта-эмиттера. С тех пор как обработчик снят, он не будет вызываться
   * при генерации событий.
   * @param type - название события с которого нужно снять обработчик
   * @param listener - обработчик который нужно снять
   */
  removeEventListener<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void;
}

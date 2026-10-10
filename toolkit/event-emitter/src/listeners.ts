import type { DefaultEventsRecord, Listener, ListenerOptions } from './types';

type ListenerDetails = {
  /**
   * Назначен ли обработчик в данный момент.
   *
   * `forEach` обходит копию списка обработчиков: так обработчики, назначенные во время
   * обхода, не вызываются в текущем порождении события. Но копия не знает о снятиях: если
   * обработчик сняли до того, как до него дошла очередь, в копии он всё равно остаётся.
   *
   * Поэтому при снятии запись помечается `actual: false`. Копия поверхностная и хранит те же
   * объекты записей, так что пометка видна и в ней. Перед вызовом достаточно проверить флаг.
   */
  actual: boolean;

  /** Параметры с которыми назначался обработчик */
  options: ListenerOptions;
};

// Map в котором слушателю события соответствует информация о слушателе:
// должен ли он вызваться только раз, должен ли он быть удалён и т.д
type EventListeners<Events extends DefaultEventsRecord, K extends keyof Events> = Map<
  Listener<Events[K]>,
  ListenerDetails
>;

type EventListenerVisitor<Events extends DefaultEventsRecord, K extends keyof Events> = (
  listener: Listener<Events[K]>,
  details: ListenerOptions
) => void;

/**
 * Хранилище обработчиков событий. В зону ответственности хранилища, входит скрытие деталей
 * реализации от пользователя. Пользователь должен иметь возможность добавлять обработчики для
 * событий, удалять их и перебирать. Но, пользователя не должно волновать как события хранятся:
 * с помощью Map, массивов, Set или обычных объектов.
 */
export class Listeners<Events extends DefaultEventsRecord> {
  private readonly listeners = new Map<keyof Events, EventListeners<Events, keyof Events>>();

  /**
   * Добавляет нового слушателя для события с указаным именем.
   * Важно! Если слушатель уже был назначен на указанное событие, ничего не произойдёт.
   * Один и тот же слушатель не может быть назначен дважды
   * @param type - название события для которого нужно добавить слушатель
   * @param listener - собственно слушатель
   * @param options - дополнительные настройки слушателя
   */
  add<K extends keyof Events>(
    type: K,
    listener: Listener<Events[K]>,
    options: ListenerOptions
  ): void {
    const eventListeners = this.getOrInsert(type);

    if (eventListeners.has(listener)) {
      return;
    }

    eventListeners.set(listener, { actual: true, options });
  }

  /**
   * Удаляет слушатель, назначенный в качестве обработчика для указанного события. Если попытаться
   * удалить слушатель, не назначенный в качестве обработчика для определённого события, ничего не
   * произойдёт.
   */
  delete<K extends keyof Events>(type: K, listener: Listener<Events[K]>): void {
    const eventListeners = this.get(type);

    if (!eventListeners) {
      return;
    }

    const details = eventListeners.get(listener);

    if (!details) {
      return;
    }

    details.actual = false;
    eventListeners.delete(listener);
  }

  /**
   * Перебирает слушателей указанного события
   */
  forEach<K extends keyof Events>(type: K, visitor: EventListenerVisitor<Events, K>): void {
    const eventListeners = this.get(type);

    if (!eventListeners) {
      return;
    }

    new Map(eventListeners).forEach((details, listener) => {
      if (details.actual) {
        visitor(listener, details.options);
      }
    });
  }

  /** Возвращает слушателей определённого события */
  private get<K extends keyof Events>(type: K): EventListeners<Events, K> | undefined {
    return this.listeners.get(type) as EventListeners<Events, K> | undefined;
  }

  /**
   * Возвращает слушателей указанного события, если они есть. Если таковых нет, добавит пустой набор
   * слушателей для данного события и вернёт пустой набор
   */
  private getOrInsert<K extends keyof Events>(type: K): EventListeners<Events, K> {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Map());
    }

    return this.listeners.get(type) as EventListeners<Events, K>;
  }
}

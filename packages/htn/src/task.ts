/** Статус выполнения задачи */
export type TaskStatus = 'success' | 'pending' | 'failed' | 'stopped';

export interface PrimitiveTask<TState> {
  /** Название задачи. Используется для отладки и логгирования */
  name: string;

  /** Проверяет можно ли выполнить задачу при указанном состоянии мира */
  canExecute(state: TState): boolean;

  /**
   * Применяет эффекты к состоянию мира. Функция иммутабельная, поэтому она не мутирует состояние,
   * а возвращает новое с применёнными эффектами
   */
  applyEffects(state: TState): TState;

  /** Начинает выполнение задачи */
  start(state: TState): TaskStatus;

  /** Вызывается каждый тик с обновлённым состоянием мира */
  update(state: TState): TaskStatus;

  /** Прекращает выполение задачи. Вызывается, когда нужно завершить задачу извне */
  stop(): void;
}

export interface CompoundTask<TState> {
  /** Название задачи. Используется для отладки и логгирования */
  name: string;

  /** Методы выполнения составной задачи */
  methods: Method<TState>[];
}

export type Task<TState> = PrimitiveTask<TState> | CompoundTask<TState>;

export interface Method<TState> {
  /** Название метода выполнения составной задачи */
  name: string;

  /** Задачи, которые нужно выполнить, чтобы реализовать метод */
  tasks: Task<TState>[];

  /**
   * Проверяет, подходит ли метод для планирования, при текущем состоянии мира
   * @param state - текущее состояние мира
   */
  preconditions(state: TState): boolean;
}

/** Проверяет, является ли задача примитивной */
export function isPrimitive<TState>(task: Task<TState>): task is PrimitiveTask<TState> {
  return 'canExecute' in task;
}

import type { PrimitiveTask, TaskResult } from './task';

/** Статус выполнения задачи */
export type ExecuteStatus = TaskResult | 'idle' | 'stopped';

export class Executor<TState> {
  private currentTaskIndex: number;
  private readonly tasks: readonly PrimitiveTask<TState>[];
  private status: ExecuteStatus;
  private taskStarted: boolean;

  /**
   * Создаёт исполнителя для указанного списка задач. Предполагается, что на вход будет приходить
   * уже декомпозированный планировщиком список задач. Так же, предполагается, что список задач не
   * может быть пустым, так как пустой список задач - это повод их перепланировать, а не выполнять.
   * @param tasks - декомпозированный список задач
   */
  constructor(tasks: readonly PrimitiveTask<TState>[]) {
    if (!tasks.length) {
      throw new Error("Tasks list can't be empty");
    }

    this.tasks = tasks;
    this.currentTaskIndex = 0;
    this.status = 'idle';
    this.taskStarted = false;
  }

  /** Возвращает задачу, которая выполняется в данный момент */
  get currentTask(): PrimitiveTask<TState> {
    const task = this.tasks[this.currentTaskIndex];

    if (!task) {
      const message = `Current task' index (${this.currentTaskIndex}) must be in range of tasks length (${this.tasks.length})`;
      throw new RangeError(message);
    }

    return task;
  }

  /** Обновляет выполнение текущей задачи */
  update(state: TState): TaskResult {
    if (!this.canTouchTask()) {
      throw new Error(`Can't update, because execution is already ${this.status}`);
    }

    this.status = this.taskStarted ? this.currentTask.update(state) : this.start(state);

    if (this.status === 'failed') {
      return this.status;
    }

    if (this.status === 'success') {
      if (!this.nextTask) {
        // Если задачи к выполнению закончились, возвращаем результат выполнения задачи и всё на этом
        return this.status;
      }

      // Но если есть ещё задачи к выполнению, несмотря на то что предыдущая задача выполнена, задачи ещё продолжают выполняться
      this.status = 'running';
      // Это нужно чтоб при следующем вызове update, исполнитель начал выполнять новую задачу, а не вызвал у неё метод update
      this.taskStarted = false;
      // Меняем индекс текущей задачи на следующий, чтобы при следующем вызове update, начала выполняться следующая задача
      this.currentTaskIndex = this.currentTaskIndex + 1;
    }

    return this.status;
  }

  /** Останавливает выполнение задач */
  stop() {
    if (!this.canTouchTask()) {
      throw new Error(`Can't stop, because execution is already ${this.status}`);
    }

    this.status = 'stopped';

    if (this.taskStarted) {
      this.currentTask.stop();
    }
  }

  /** Начинает выполнение задачи */
  private start(state: TState): TaskResult {
    if (!this.currentTask.canExecute(state)) {
      return 'failed';
    }

    const result = this.currentTask.start(state);
    this.taskStarted = true;

    return result;
  }

  /**
   * Проверяет, можно ли "трогать" текущую задачу. Если она уже выполнена,
   * остановлена или завершилась с ошибкой, трогать нельзя
   */
  private canTouchTask(): boolean {
    return !['failed', 'success', 'stopped'].includes(this.status);
  }

  /** Возвращает следующую к выполнению задачу */
  private get nextTask(): PrimitiveTask<TState> | null {
    const index = this.currentTaskIndex + 1;

    return this.tasks[index] ?? null;
  }
}

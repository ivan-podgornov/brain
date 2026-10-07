import { Executor, type IExecutor } from './executor';
import { Planner, type IPlanner } from './planner';
import type { PrimitiveTask, Task } from './task';

export type HTNDeps<TState> = {
  executorFactory: (tasks: readonly PrimitiveTask<TState>[]) => IExecutor<TState>;
  plannerFactory: () => IPlanner<TState>;
};

export function getDefaultDeps<TState>(): HTNDeps<TState> {
  return {
    executorFactory: (tasks: readonly PrimitiveTask<TState>[]) => new Executor<TState>(tasks),
    plannerFactory: () => new Planner<TState>(),
  };
}

export class HTN<TState> {
  private readonly executorFactory: HTNDeps<TState>['executorFactory'];
  private readonly planner: IPlanner<TState>;
  private readonly root: Task<TState>;

  private executor: IExecutor<TState> | null;

  constructor(root: Task<TState>, deps: HTNDeps<TState> = getDefaultDeps<TState>()) {
    this.executorFactory = deps.executorFactory;
    this.planner = deps.plannerFactory();
    this.root = root;
    this.executor = null;
  }

  update(state: TState) {
    if (!this.executor) {
      const tasks = this.planner.plan(this.root, state);

      if (!tasks) {
        return;
      }

      this.executor = this.executorFactory(tasks);
    }

    const status = this.executor.update(state);

    if (status !== 'running') {
      this.executor = null;
    }
  }

  stop() {
    if (!this.executor) {
      return;
    }

    this.executor.stop();
    this.executor = null;
  }
}

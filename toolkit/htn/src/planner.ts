import { isPrimitive } from './task';
import type { PrimitiveTask, Task } from './task';

export interface IPlanner<TState> {
  plan(root: Task<TState>, state: TState): PrimitiveTask<TState>[] | null;
}

export class Planner<TState> implements IPlanner<TState> {
  plan(root: Task<TState>, state: TState): PrimitiveTask<TState>[] | null {
    return this.decompose([root], state);
  }

  private decompose(tasks: Task<TState>[], state: TState): PrimitiveTask<TState>[] | null {
    const [head, ...tail] = tasks;

    if (!head) {
      return [];
    }

    if (isPrimitive(head)) {
      if (!head.canExecute(state)) {
        return null;
      }

      const decomposedTail = this.decompose(tail, head.applyEffects(state));

      return decomposedTail && [head].concat(decomposedTail);
    }

    for (const method of head.methods) {
      if (!method.preconditions(state)) {
        continue;
      }

      const decomposedSubtasks = this.decompose(method.tasks.concat(tail), state);

      if (decomposedSubtasks) {
        return decomposedSubtasks;
      }
    }

    return null;
  }
}

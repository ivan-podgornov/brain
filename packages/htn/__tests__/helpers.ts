import { vi } from 'vitest';
import type { Mocked } from 'vitest';

import type { CompoundTask, PrimitiveTask, Method, Task } from '../src/task';

export type TestState = { canExecute: boolean; counter: number };

export const testState = { canExecute: true, counter: 0 };

export function primitive(name: string): PrimitiveTask<TestState> {
  return {
    name,
    applyEffects: (state) => ({ ...state, canExecute: true }),
    canExecute: (state) => state.canExecute,
    start: () => 'pending',
    update: () => 'pending',
    stop: () => {},
  };
}

export function blockedPrimitive(name: string): PrimitiveTask<TestState> {
  return {
    ...primitive(name),
    canExecute: () => false,
  };
}

export function compound(name: string, ...methods: Method<TestState>[]): CompoundTask<TestState> {
  return {
    name,
    methods,
  };
}

export function method(name: string, ...tasks: Task<TestState>[]): Method<TestState> {
  return {
    name,
    tasks,
    preconditions: (state) => state.canExecute,
  };
}

export function blockedMethod(name: string, ...tasks: Task<TestState>[]): Method<TestState> {
  return {
    ...method(name, ...tasks),
    preconditions: () => false,
  };
}

/**
 * Примитив-шпион: можно выполнить всегда, а `canExecute` и `applyEffects` запоминают вызовы.
 * Если передан `stateAfter`, то эффект примитива - вернуть именно это состояние
 */
export function spyPrimitive(
  name: string,
  stateAfter?: TestState
): PrimitiveTask<TestState> &
  Pick<Mocked<PrimitiveTask<TestState>>, 'canExecute' | 'applyEffects'> {
  return {
    ...primitive(name),
    canExecute: vi.fn(() => true),
    applyEffects: vi.fn((state: TestState) => stateAfter ?? state),
  };
}

/** Метод-шпион: подходит всегда, а `preconditions` запоминает вызовы */
export function spyMethod(
  name: string,
  ...tasks: Task<TestState>[]
): Method<TestState> & Pick<Mocked<Method<TestState>>, 'preconditions'> {
  return {
    ...method(name, ...tasks),
    preconditions: vi.fn(() => true),
  };
}

export function getNames(tasks: Task<TestState>[]): string[] {
  return tasks.map((task) => task.name);
}

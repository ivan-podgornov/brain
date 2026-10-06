import { describe, expect, it } from 'vitest';

import { Planner } from '../../src/planner';
import type { Task } from '../../src/task';

import {
  blockedMethod,
  blockedPrimitive,
  compound,
  getNames,
  method,
  primitive,
  testState,
} from '../helpers';

import type { TestState } from '../helpers';

describe('Planner', () => {
  describe('#plan', () => {
    describe('Примитивные задачи', () => {
      it('Возвращает null, если задачу выполнить невозможно', () => {
        const planner = new Planner<TestState>();
        const result = planner.plan(primitive('Primitive'), { ...testState, canExecute: false });

        expect(result).toBeNull();
      });

      it('Возвращает исходную задачу, если её можно выполнить при указанном состоянии', () => {
        const planner = new Planner<TestState>();
        const task = primitive('Primitive');
        const result = planner.plan(task, { ...testState, canExecute: true });

        expect(result).toStrictEqual([task]);
      });
    });

    describe('Составные задачи', () => {
      it('Возвращает null, если предусловия ни одного из методов не подходят под выполнение', () => {
        const planner = new Planner<TestState>();
        const root = compound(
          'Compound',
          blockedMethod('Method-1', primitive('Primitive')),
          blockedMethod('Method-2', primitive('Primitive'))
        );

        const result = planner.plan(root, { ...testState, canExecute: true });

        expect(result).toBeNull();
      });

      it('Возвращает null, если предусловия ни одного из методов вложенной составной задачи не подходят под выполнение', () => {
        const planner = new Planner<TestState>();
        const root = compound(
          'Compound',
          method(
            'Method-1',
            compound('BlockedCompound', blockedMethod('Method-2', primitive('Primitive')))
          )
        );

        const result = planner.plan(root, { ...testState, canExecute: true });

        expect(result).toBeNull();
      });

      it('Возвращает null, если предусловия метода подходят под выполнение, но невозможно выполнить примитив в одной из вложенных в него составных задач', () => {
        const planner = new Planner<TestState>();
        const root = compound(
          'Compound',
          method(
            'Compound -> Method',
            compound(
              'Compound -> Method -> Compound',
              method('Compound -> Method -> Compound -> Method', blockedPrimitive('Primitive'))
            )
          )
        );

        const result = planner.plan(root, { ...testState, canExecute: true });

        expect(result).toBeNull();
      });

      it('Возвращает null, если предусловия метода подходят под выполнение, но невозможно выполнить один из его вложенных примитивов', () => {
        const planner = new Planner<TestState>();
        const root = compound(
          'Compound',
          method(
            'Method-1',
            compound('BlockedCompound', method('Method-2', blockedPrimitive('Primitive')))
          )
        );

        const result = planner.plan(root, { ...testState, canExecute: true });

        expect(result).toBeNull();
      });

      it('Возвращает массив декомпозированных задач того метода, который подходит под выполнение', () => {
        const planner = new Planner<TestState>();
        const root = compound(
          'Compound',
          method(
            'Method',
            primitive('Primitive 1'),
            compound(
              'Compound',
              blockedMethod('Method', primitive('Unreachable primitive')),
              method('Method', primitive('Primitive'), blockedPrimitive('Blocked primitive')),
              method('Method', primitive('Primitive 2'), primitive('Primitive 3'))
            ),
            compound('Compound', method('Method', primitive('Primitive 4'))),
            primitive('Primitive 5')
          ),
          method('Unreachable method', primitive('Unreachable primitive'))
        );

        const tasks = planner.plan(root, { ...testState, canExecute: true });
        const names = getNames(tasks as Task<TestState>[]);

        expect(names).toStrictEqual([
          'Primitive 1',
          'Primitive 2',
          'Primitive 3',
          'Primitive 4',
          'Primitive 5',
        ]);
      });
    });
  });
});

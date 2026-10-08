import { describe, expect, it } from 'vitest';

import { Planner } from '../../src/planner';

import { blockedPrimitive, compound, method, spyMethod, spyPrimitive, testState } from '../helpers';

import type { TestState } from '../helpers';

describe('Planner', () => {
  describe('#plan', () => {
    describe('Эффекты', () => {
      it('Примитив учитывает эффекты соседнего примитива, идущего перед ним', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = { ...testState, counter: 1 };
        const setter = spyPrimitive('Setter', afterSetter);
        const reader = spyPrimitive('Reader');
        const root = compound('Compound', method('Method', setter, reader));

        planner.plan(root, testState);

        expect(reader.canExecute).toHaveBeenCalledTimes(1);
        expect(reader.canExecute).toHaveBeenCalledWith(afterSetter);
      });

      it('Примитив-ребёнок составной задачи учитывает эффекты детей соседней составной, идущего перед его родителем', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = { ...testState, counter: 1 };
        const setter = spyPrimitive('Setter', afterSetter);
        const reader = spyPrimitive('Reader');
        const root = compound(
          'Compound',
          method(
            'Method',
            compound('Setter compound', method('Setter method', setter)),
            compound('Reader compound', method('Reader method', reader))
          )
        );

        planner.plan(root, testState);

        expect(reader.canExecute).toHaveBeenCalledTimes(1);
        expect(reader.canExecute).toHaveBeenCalledWith(afterSetter);
      });

      it('Примитив учитывает эффекты детей соседней составной, идущей прямо перед ним', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = { ...testState, counter: 1 };
        const setter = spyPrimitive('Setter', afterSetter);
        const reader = spyPrimitive('Reader');
        const root = compound(
          'Compound',
          method('Method', compound('Setter compound', method('Setter method', setter)), reader)
        );

        planner.plan(root, testState);

        expect(reader.canExecute).toHaveBeenCalledTimes(1);
        expect(reader.canExecute).toHaveBeenCalledWith(afterSetter);
      });

      it('Методы составной задачи учитывают эффекты соседнего примитива, идущего перед ней', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = { ...testState, counter: 1 };
        const setter = spyPrimitive('Setter', afterSetter);
        const readerMethod = spyMethod('Reader method', spyPrimitive('Primitive'));
        const root = compound(
          'Compound',
          method('Method', setter, compound('Reader compound', readerMethod))
        );

        planner.plan(root, testState);

        expect(readerMethod.preconditions).toHaveBeenCalledTimes(1);
        expect(readerMethod.preconditions).toHaveBeenCalledWith(afterSetter);
      });

      it('Методы составной задачи учитывают эффекты детей соседней составной, идущей перед ней', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = { ...testState, counter: 1 };
        const setter = spyPrimitive('Setter', afterSetter);
        const readerMethod = spyMethod('Reader method', spyPrimitive('Primitive'));
        const root = compound(
          'Compound',
          method(
            'Method',
            compound('Setter compound', method('Setter method', setter)),
            compound('Reader compound', readerMethod)
          )
        );

        planner.plan(root, testState);

        expect(readerMethod.preconditions).toHaveBeenCalledTimes(1);
        expect(readerMethod.preconditions).toHaveBeenCalledWith(afterSetter);
      });

      it('Предусловия метода не учитывает эффекты его детей-задач', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = { ...testState, counter: 1 };
        const setter = spyPrimitive('Setter', afterSetter);
        const testedMethod = spyMethod('Method', setter);
        const root = compound('Compound', testedMethod);

        planner.plan(root, testState);

        expect(testedMethod.preconditions).toHaveBeenCalledTimes(1);
        expect(testedMethod.preconditions).toHaveBeenCalledWith(testState);
      });

      it('Следующий метод не учитывает эффекты метода-соседа, который не удалось выполнить', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = { ...testState, counter: 1 };
        const setter = spyPrimitive('Setter', afterSetter);
        const nextMethod = spyMethod('Next method', spyPrimitive('Primitive'));
        const root = compound(
          'Compound',
          method('Failed method', setter, blockedPrimitive('Blocked')),
          nextMethod
        );

        planner.plan(root, testState);

        expect(nextMethod.preconditions).toHaveBeenCalledTimes(1);
        expect(nextMethod.preconditions).toHaveBeenCalledWith(testState);
      });

      it('Примитив метода не учитывает эффекты метода-соседа, который не удалось выполнить', () => {
        const planner = new Planner<TestState>();
        const afterSetter: TestState = { ...testState, counter: 1 };
        const setter = spyPrimitive('Setter', afterSetter);
        const nextPrimitive = spyPrimitive('Primitive');
        const root = compound(
          'Compound',
          method('Failed method', setter, blockedPrimitive('Blocked')),
          method('Next method', nextPrimitive)
        );

        planner.plan(root, testState);

        expect(nextPrimitive.canExecute).toHaveBeenCalledTimes(1);
        expect(nextPrimitive.canExecute).toHaveBeenCalledWith(testState);
      });
    });
  });
});

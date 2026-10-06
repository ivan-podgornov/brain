import { describe, expect, it, vi } from 'vitest';

import { Executor } from '../../../src/executor';
import { primitive, testState } from '../../helpers';

describe('Executor', () => {
  describe('#update', () => {
    describe('Если задачи уже начали выполняться', () => {
      it('Если при прошлом вызове задача не завершила своё выполнение, продолжает её выполнять', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('running');
        const updateSpy = vi.spyOn(task, 'update').mockReturnValue('running');

        const executor = new Executor([task]);
        executor.update(testState); // Начинаем выполнять задачу
        executor.update(testState); // Продолжаем выполнять задачу

        expect(updateSpy).toHaveBeenCalledExactlyOnceWith(testState);
      });

      it('Если при прошлом вызове задача не завершила своё выполнение, больше не проверяет можно ли её выполнять при текущем состоянии мира', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('running');
        vi.spyOn(task, 'update').mockReturnValue('running');
        const canExecuteSpy = vi.spyOn(task, 'canExecute').mockReturnValue(true);

        const executor = new Executor([task]);
        executor.update(testState); // Начинаем выполнять задачу
        executor.update(testState); // Продолжаем выполнять задачу

        expect(canExecuteSpy).toHaveBeenCalledExactlyOnceWith(testState);
      });

      it('Если при прошлом вызове, задача завершила своё выполнение успешно и есть ещё задачи на выполнение, проверяет можно ли начинать выполнять следующую задачу', () => {
        // arrange
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');

        const nextTask = primitive('Next task');
        const canExecuteSpy = vi.spyOn(nextTask, 'canExecute').mockReturnValue(true);

        // act
        const executor = new Executor([successTask, nextTask]);
        executor.update(testState); // Начинаем выполнять первую задачу, она сразу же выполнилась успешно
        executor.update(testState); // Должна начать выполняться следующая задача

        // assert
        expect(canExecuteSpy).toHaveBeenCalledExactlyOnceWith(testState);
      });

      it('Если при прошлом вызове, задача завершила своё выполнение успешно, есть ещё задачи на выполнение и следущую задачу нельзя выполнять при текущем состоянии мира, не начинает её выполнять', () => {
        // arrange
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');

        const nextTask = primitive('Next task');
        vi.spyOn(nextTask, 'canExecute').mockReturnValue(false);
        const startSpy = vi.spyOn(nextTask, 'start').mockReturnValue('failed');
        const updateSpy = vi.spyOn(nextTask, 'update').mockReturnValue('failed');

        // act
        const executor = new Executor([successTask, nextTask]);
        executor.update(testState); // Начинаем выполнять первую задачу, она сразу же выполнилась успешно
        executor.update(testState); // Должна начать выполняться следующая задача

        // assert
        expect(startSpy).not.toHaveBeenCalled();
        expect(updateSpy).not.toHaveBeenCalled();
      });

      it('Если при прошлом вызове, задача завершила своё выполнение успешно и есть ещё задачи на выполнение, начинает выполнять следующую задачу из списка', () => {
        // arrange
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');

        const nextTask = primitive('Next task');
        const startSpy = vi.spyOn(nextTask, 'start').mockReturnValue('running');
        const updateSpy = vi.spyOn(nextTask, 'update').mockReturnValue('running');

        // act
        const executor = new Executor([successTask, nextTask]);
        executor.update(testState); // Начинаем выполнять первую задачу, она сразу же выполнилась успешно
        executor.update(testState); // Должна начать выполняться следующая задача

        // assert
        expect(startSpy).toHaveBeenCalledExactlyOnceWith(testState);
        expect(updateSpy).not.toHaveBeenCalled();
      });

      it('Возвращает "success", если задача была единственной и выполнилась', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('running');
        vi.spyOn(task, 'update').mockReturnValue('success');

        const executor = new Executor([task]);
        executor.update(testState);
        const result = executor.update(testState);

        expect(result).toBe('success');
      });

      it('Возвращает "running", если задача была единственной и требует ещё времени на выполнение', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('running');
        vi.spyOn(task, 'update').mockReturnValue('running');

        const executor = new Executor([task]);
        const result = executor.update(testState);

        expect(result).toBe('running');
      });

      it('Возвращает "running", если задача выполнилась, но есть ещё задачи на выполнение', () => {
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('running');
        vi.spyOn(successTask, 'update').mockReturnValue('success');

        const executor = new Executor([successTask, primitive('Another Task')]);
        executor.update(testState);
        const result = executor.update(testState);

        expect(result).toBe('running');
      });

      it('Возвращает "failed", если задача была единственной и выполнение завершилось с ошибкой', () => {
        const failedTask = primitive('Failed Task');
        vi.spyOn(failedTask, 'start').mockReturnValue('running');
        vi.spyOn(failedTask, 'update').mockReturnValue('failed');

        const executor = new Executor([failedTask]);
        executor.update(testState);
        const result = executor.update(testState);

        expect(result).toBe('failed');
      });

      it('Возвращает "failed", если выполнение задачи завершилось с ошибкой и есть ещё задачи на выполнение', () => {
        const failedTask = primitive('Failed Task');
        vi.spyOn(failedTask, 'start').mockReturnValue('running');
        vi.spyOn(failedTask, 'update').mockReturnValue('failed');

        const executor = new Executor([failedTask, primitive('Another Task')]);
        executor.update(testState);
        const result = executor.update(testState);

        expect(result).toBe('failed');
      });

      it('Возвращает "failed", если предыдущая задача выполнилась, а следующую задачу невозможно выполнить при текущем состоянии мира', () => {
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');

        const failedTask = primitive('Failed Task');
        vi.spyOn(failedTask, 'canExecute').mockReturnValue(false);

        const executor = new Executor([successTask, failedTask]);
        executor.update(testState);
        const result = executor.update(testState);

        expect(result).toBe('failed');
      });
    });
  });
});

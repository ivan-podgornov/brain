import { describe, expect, it, vi } from 'vitest';

import { Executor } from '../../../src/executor';
import { primitive, testState } from '../../helpers';

describe('Executor', () => {
  describe('#update', () => {
    describe('Если задачи ещё не выполнялись', () => {
      it('Проверяет, можно ли выполнить первую задачу из списка с указанным состоянием мира', () => {
        const task = primitive('Primitive Task');
        const canExecuteSpy = vi.spyOn(task, 'canExecute').mockReturnValue(false);

        const executor = new Executor([task]);
        executor.update(testState);

        expect(canExecuteSpy).toHaveBeenCalledExactlyOnceWith(testState);
      });

      it('Не начинает выполнять первую задачу, если её нельзя выполнить при указанном состоянии мира', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'canExecute').mockReturnValue(false);
        const startSpy = vi.spyOn(task, 'start').mockReturnValue('running');
        const updateSpy = vi.spyOn(task, 'update').mockReturnValue('running');

        const executor = new Executor([task]);
        executor.update(testState);

        expect(startSpy).not.toHaveBeenCalled();
        expect(updateSpy).not.toHaveBeenCalled();
      });

      it('Начинает выполнять первую задачу из списка', () => {
        const task = primitive('Primitive Task');
        const startSpy = vi.spyOn(task, 'start').mockReturnValue('running');
        const updateSpy = vi.spyOn(task, 'update').mockReturnValue('running');

        const executor = new Executor([task]);
        executor.update(testState);

        expect(startSpy).toHaveBeenCalledExactlyOnceWith(testState);
        expect(updateSpy).not.toHaveBeenCalled();
      });

      it('Не начинает выполнять следующую задачу, если задача выполнилась сразу и есть ещё задачи на выполнение', () => {
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');
        const anotherTask = primitive('Another Task');
        const startSpy = vi.spyOn(anotherTask, 'start').mockReturnValue('running');
        const updateSpy = vi.spyOn(anotherTask, 'update').mockReturnValue('running');

        const executor = new Executor([successTask, anotherTask]);
        executor.update(testState);

        expect(startSpy).not.toHaveBeenCalled();
        expect(updateSpy).not.toHaveBeenCalled();
      });

      it('Возвращает "success", если задача была единственной и выполнилась сразу', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('success');

        const executor = new Executor([task]);
        const result = executor.update(testState);

        expect(result).toBe('success');
      });

      it('Возвращает "running", если задача была единственной и требует ещё времени на выполнение', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('running');

        const executor = new Executor([task]);
        const result = executor.update(testState);

        expect(result).toBe('running');
      });

      it('Возвращает "running", если задача выполнилась сразу, но есть ещё задачи на выполнение', () => {
        const successTask = primitive('Success Task');
        vi.spyOn(successTask, 'start').mockReturnValue('success');

        const executor = new Executor([successTask, primitive('Another Task')]);
        const result = executor.update(testState);

        expect(result).toBe('running');
      });

      it('Возвращает "failed", если задача была единственной и выполнение завершилось с ошибкой', () => {
        const failedTask = primitive('Failed Task');
        vi.spyOn(failedTask, 'start').mockReturnValue('failed');

        const executor = new Executor([failedTask]);
        const result = executor.update(testState);

        expect(result).toBe('failed');
      });

      it('Возвращает "failed", если задача не может быть выполнена при текущем состоянии мира', () => {
        const failedTask = primitive('Failed Task');
        vi.spyOn(failedTask, 'canExecute').mockReturnValue(false);

        const executor = new Executor([failedTask]);
        const result = executor.update(testState);

        expect(result).toBe('failed');
      });

      it('Возвращает "failed", если выполнение задачи завершилось с ошибкой и есть ещё задачи на выполнение', () => {
        const failedTask = primitive('Failed Task');
        vi.spyOn(failedTask, 'start').mockReturnValue('failed');

        const executor = new Executor([failedTask, primitive('Another Task')]);
        const result = executor.update(testState);

        expect(result).toBe('failed');
      });
    });
  });
});

import { describe, expect, it, vi } from 'vitest';

import { Executor } from '../../src/executor';
import { primitive, testState } from '../helpers';

describe('Executor', () => {
  describe('#stop', () => {
    it('Выбрасывает ошибку, если выполнение задач уже завершилось успешно', () => {
      const task = primitive('Primitive Task');
      vi.spyOn(task, 'start').mockReturnValue('success');
      const executor = new Executor([task]);

      executor.update(testState);

      expect(() => executor.stop()).toThrow("Can't stop, because execution is already success");
    });

    it('Выбрасывает ошибку, если выполнение задач ранее завершилось с ошибкой', () => {
      const task = primitive('Primitive Task');
      vi.spyOn(task, 'start').mockReturnValue('failed');
      const executor = new Executor([task]);

      executor.update(testState);

      expect(() => executor.stop()).toThrow("Can't stop, because execution is already failed");
    });

    it('Выбрасывает ошибку, если выполнее задач было остановлено ранее', () => {
      const task = primitive('Primitive Task');
      const executor = new Executor([task]);

      executor.stop();

      expect(() => executor.stop()).toThrow("Can't stop, because execution is already stopped");
    });

    it('Завершает выполнение в целом, но не пытается завершить задачу, если её выполнение ещё не началось', () => {
      const task = primitive('Primitive Task');
      const stopSpy = vi.spyOn(task, 'stop');

      const executor = new Executor([task]);
      executor.stop();

      expect(stopSpy).not.toHaveBeenCalled();
    });

    it('Завершает выполнение в целом и выполнение текущей задачи, если её выполнение уже началось', () => {
      const task = primitive('Primitive Task');
      const stopSpy = vi.spyOn(task, 'stop');

      const executor = new Executor([task]);
      executor.update(testState);
      executor.stop();

      expect(stopSpy).toHaveBeenCalledOnce();
    });

    it('Если на момент завершения выполнения, одна задача уже была выполнена, а вторая ещё не начала выполняться, завершает выполнение в целом, но не пытается завершить выполнение ни одной из задач', () => {
      // arrange
      const firstTask = primitive('First task');
      vi.spyOn(firstTask, 'start').mockReturnValue('success');
      const firstTaskStopSpy = vi.spyOn(firstTask, 'stop');

      const unreachableTask = primitive('Unreachable task');
      const unreachableTaskStopSpy = vi.spyOn(unreachableTask, 'stop');

      // act
      const executor = new Executor([firstTask, unreachableTask]);
      executor.update(testState);
      executor.stop();

      // assert
      expect(firstTaskStopSpy).not.toHaveBeenCalled();
      expect(unreachableTaskStopSpy).not.toHaveBeenCalled();
    });
  });
});

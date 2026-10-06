import { describe, expect, it, vi } from 'vitest';

import { Executor } from '../../src/executor';
import { primitive } from '../helpers';

describe('Executor', () => {
  describe('#constructor', () => {
    it('Выбрасывает ошибку, если список задач на выполнение пуст', () => {
      expect(() => new Executor([])).toThrow("Tasks list can't be empty");
    });

    it('Возвращает экземпляр исполнителя, если указана хотя бы одна задача к выполнению', () => {
      const tasks = [primitive('Primitive Task')];
      const executor = new Executor(tasks);

      expect(executor).toBeInstanceOf(Executor);
    });

    it('Не начинает выполнять задачи, пока не запустится метод update', () => {
      const task = primitive('Primitive Task');
      const startSpy = vi.spyOn(task, 'start');
      const stopSpy = vi.spyOn(task, 'stop');
      const updateSpy = vi.spyOn(task, 'update');

      const executor = new Executor([task]);

      expect(executor.currentTask).toStrictEqual(task);
      expect(startSpy).not.toHaveBeenCalled();
      expect(stopSpy).not.toHaveBeenCalled();
      expect(updateSpy).not.toHaveBeenCalled();
    });
  });
});

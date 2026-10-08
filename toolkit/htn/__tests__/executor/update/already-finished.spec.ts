import { describe, expect, it, vi } from 'vitest';

import { Executor } from '../../../src/executor';
import { primitive, testState } from '../../helpers';

describe('Executor', () => {
  describe('#update', () => {
    describe('Если выполнение задач уже завершилось ранее', () => {
      it('Выбрасывает ошибку, если выполнение задач уже завершилось успешно', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('success');
        const executor = new Executor([task]);

        executor.update(testState);

        expect(() => executor.update(testState)).toThrow(
          "Can't update, because execution is already success"
        );
      });

      it('Выбрасывает ошибку, если выполнение задач уже завершилось с ошибкой', () => {
        const task = primitive('Primitive Task');
        vi.spyOn(task, 'start').mockReturnValue('failed');
        const executor = new Executor([task]);

        executor.update(testState);

        expect(() => executor.update(testState)).toThrow(
          "Can't update, because execution is already failed"
        );
      });

      it('Выбрасывает ошибку, если выполнение задач было остановлено ранее', () => {
        const executor = new Executor([primitive('Primitive Task')]);

        executor.stop();

        expect(() => executor.update(testState)).toThrow(
          "Can't update, because execution is already stopped"
        );
      });
    });
  });
});

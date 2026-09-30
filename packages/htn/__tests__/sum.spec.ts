import { describe, expect, it } from 'vitest';

import { sum } from '../sum';

describe('sum', () => {
  it('работает переместительное свойство сложения', () => {
    expect.assertions(1);
    expect(sum(3, 2)).toBe(sum(2, 3));
  });

  it('если к отрицательному число прибавить отрицательное, получится число меньшее чем оба слагаемых', () => {
    expect.assertions(1);
    expect(sum(-2, -7)).toBe(-9);
  });
});

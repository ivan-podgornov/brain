export const optionsCases = [
  { name: 'без опций', options: undefined },
  { name: 'once: false', options: { once: false } },
  { name: 'once: true', options: { once: true } },
] as const;

export type TestEvents = {
  tick: undefined;
  update: number;
};

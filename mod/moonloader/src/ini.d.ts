declare module 'inicfg' {
  interface Inicfg {
    /** Загружает INI файл */
    load(data: unknown, path: string): boolean;

    /** Сохраняет INI файл */
    save(data: unknown, path: string): boolean;
  }

  const inicfg: Inicfg;

  // eslint-disable-next-line import-x/no-default-export -- это moonloader использует дефолтный экспот
  export default inicfg;
}

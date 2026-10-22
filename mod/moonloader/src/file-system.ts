/**
 * Интерфейс файловой системы MoonLoader
 */
interface FileSystemGlobal {
  /** Проверяет существование файла */
  doesFileExist(this: void, path: string): boolean;

  /** Проверяет существование директории */
  doesDirectoryExist(this: void, path: string): boolean;

  /** Создает директорию */
  createDirectory(this: void, path: string): boolean;

  /** Получает путь к рабочей директории скрипта */
  getWorkingDirectory(this: void): string;

  /** Получает путь к папке игры */
  getGameDirectory(this: void): string;
}

declare const _G: FileSystemGlobal;

export const {
  doesFileExist,
  doesDirectoryExist,
  createDirectory,
  getWorkingDirectory,
  getGameDirectory,
} = _G;

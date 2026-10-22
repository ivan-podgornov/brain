/**
 * Интерфейс сетевых функций MoonLoader
 */
interface NetworkGlobal {
  /** Получает никнейм игрока по ID */
  getPlayerName(this: void, playerId: number): string;

  /** Получает пинг игрока */
  getPlayerPing(this: void, playerId: number): number;

  /** Получает IP и порт сервера */
  getServerAddress(this: void): LuaMultiReturn<[string, number]>;

  /** Отправляет команду на сервер */
  sendServerCommand(this: void, command: string): void;

  /** Отправляет сообщение в чат */
  sendChat(this: void, message: string): void;

  /** Проверяет подключение к серверу */
  isPlayerConnected(this: void, playerId: number): boolean;

  /** Получает счет игрока */
  getPlayerScore(this: void, playerId: number): number;

  /** Проверяет, пауза ли у игрока */
  isPlayerPaused(this: void, playerId: number): boolean;
}

declare const _G: NetworkGlobal;

export const {
  getPlayerName,
  getPlayerPing,
  getServerAddress,
  sendServerCommand,
  sendChat,
  isPlayerConnected,
  getPlayerScore,
  isPlayerPaused,
} = _G;

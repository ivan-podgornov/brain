import type { PedHandle } from './handles';

/**
 * Интерфейс функций для работы с игроком в MoonLoader
 */
interface PlayerGlobal {
  /** Получает персонажа игрока */
  getPlayerChar(this: void, playerId: number): PedHandle;

  /** Получает ID игрока */
  getPlayerId(this: void): number;

  /** Получает координаты игрока */
  getActivePlayerCoords(this: void): LuaMultiReturn<[number, number, number]>;

  /** Устанавливает координаты игрока */
  setPlayerCoordinates(this: void, playerId: number, x: number, y: number, z: number): void;

  /** Получает угол камеры игрока */
  getCameraFrontVector(this: void): LuaMultiReturn<[number, number, number]>;

  /** Получает позицию камеры */
  getCameraCoordinates(this: void): LuaMultiReturn<[number, number, number]>;

  /** Устанавливает позицию камеры */
  setCameraPosition(this: void, x: number, y: number, z: number): void;

  /** Направляет камеру на точку */
  pointCameraAtPoint(this: void, x: number, y: number, z: number, switchStyle: number): void;

  /** Направляет камеру на персонажа */
  pointCameraAtChar(this: void, ped: PedHandle, mode: number, switchStyle: number): void;

  /** Восстанавливает камеру за игроком */
  restoreCameraJumpcut(this: void): void;

  /** Устанавливает управление игроком */
  setPlayerControl(this: void, playerId: number, state: boolean): void;

  /** Получает деньги игрока */
  getPlayerMoney(this: void, playerId: number): number;

  /** Устанавливает деньги игроку */
  setPlayerMoney(this: void, playerId: number, money: number): void;

  /** Добавляет деньги игроку */
  addToPlayerMoney(this: void, playerId: number, money: number): void;

  /** Получает уровень розыска */
  getPlayerWantedLevel(this: void, playerId: number): number;

  /** Устанавливает уровень розыска */
  alterWantedLevel(this: void, playerId: number, level: number): void;

  /** Очищает уровень розыска */
  clearWantedLevel(this: void, playerId: number): void;

  /** Устанавливает максимальный уровень розыска */
  setMaxWantedLevel(this: void, level: number): void;

  /** Проверяет, свободен ли игрок для миссии */
  isPlayerPlayingAsChar(this: void, playerId: number): boolean;

  /** Проверяет, жив ли игрок */
  isPlayerDead(this: void, playerId: number): boolean;
}

declare const _G: PlayerGlobal;

export const {
  getPlayerChar,
  getPlayerId,
  getActivePlayerCoords,
  setPlayerCoordinates,
  getCameraFrontVector,
  getCameraCoordinates,
  setCameraPosition,
  pointCameraAtPoint,
  pointCameraAtChar,
  restoreCameraJumpcut,
  setPlayerControl,
  getPlayerMoney,
  setPlayerMoney,
  addToPlayerMoney,
  getPlayerWantedLevel,
  alterWantedLevel,
  clearWantedLevel,
  setMaxWantedLevel,
  isPlayerPlayingAsChar,
  isPlayerDead,
} = _G;

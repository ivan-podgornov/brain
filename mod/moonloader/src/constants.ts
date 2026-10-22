import type { PedHandle } from './handles';

/**
 * Интерфейс констант MoonLoader
 */
interface ConstantsGlobal {
  /** Главный персонаж игрока */
  readonly PLAYER_PED: PedHandle;
}

declare const _G: ConstantsGlobal;

/** Типы пешеходов */
export enum PedType {
  PLAYER1 = 0,
  PLAYER2 = 1,
  PLAYER_NETWORK = 2,
  PLAYER_UNUSED = 3,
  CIVMALE = 4,
  CIVFEMALE = 5,
  COP = 6,
  GANG = 7,
  DEALER = 8,
  MEDIC = 9,
  FIREMAN = 10,
  CRIMINAL = 11,
  SPECIAL = 12,
  PROSTITUTE = 13,
}

/** Типы оружия */
export enum WeaponType {
  FIST = 0,
  BRASSKNUCKLE = 1,
  GOLFCLUB = 2,
  NIGHTSTICK = 3,
  KNIFE = 4,
  BASEBALLBAT = 5,
  SHOVEL = 6,
  POOLSTICK = 7,
  KATANA = 8,
  CHAINSAW = 9,
  DILDO = 10,
  VIBRATOR = 11,
  FLOWER = 14,
  CANE = 15,
  GRENADE = 16,
  TEARGAS = 17,
  MOLOTOV = 18,
  COLT45 = 22,
  SILENCED = 23,
  DEAGLE = 24,
  SHOTGUN = 25,
  SAWEDOFF = 26,
  SHOTGSPA = 27,
  UZI = 28,
  MP5 = 29,
  AK47 = 30,
  M4 = 31,
  TEC9 = 32,
  RIFLE = 33,
  SNIPER = 34,
  ROCKETLAUNCHER = 35,
  HEATSEEKER = 36,
  FLAMETHROWER = 37,
  MINIGUN = 38,
  SATCHEL = 39,
  BOMB = 40,
  SPRAYCAN = 41,
  FIREEXTINGUISHER = 42,
  CAMERA = 43,
  PARACHUTE = 46,
  VEHICLE = 49,
  DROWN = 53,
  COLLISION = 54,
}

/** Типы погоды */
export enum WeatherType {
  EXTRASUNNY_LA = 0,
  SUNNY_LA = 1,
  EXTRASUNNY_SMOG_LA = 2,
  SUNNY_SMOG_LA = 3,
  CLOUDY_LA = 4,
  SUNNY_SF = 5,
  EXTRASUNNY_SF = 6,
  CLOUDY_SF = 7,
  RAINY_SF = 8,
  FOGGY_SF = 9,
  SUNNY_VEGAS = 10,
  EXTRASUNNY_VEGAS = 11,
  CLOUDY_VEGAS = 12,
  EXTRASUNNY_COUNTRYSIDE = 13,
  SUNNY_COUNTRYSIDE = 14,
  CLOUDY_COUNTRYSIDE = 15,
  RAINY_COUNTRYSIDE = 16,
  EXTRASUNNY_DESERT = 17,
  SUNNY_DESERT = 18,
  SANDSTORM_DESERT = 19,
  UNDERWATER = 20,
  EXTRACOLOURS_1 = 21,
  EXTRACOLOURS_2 = 22,
}

/** Модели транспорта */
export enum VehicleModel {
  LANDSTALKER = 400,
  BRAVURA = 401,
  BUFFALO = 402,
  LINERUNNER = 403,
  PERENNIAL = 404,
  SENTINEL = 405,
  // ... добавьте остальные модели по необходимости
}

export const { PLAYER_PED } = _G;

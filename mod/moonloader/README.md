# Moonloader TypeScript Definitions

Полные TypeScript определения для Moonloader API, обеспечивающие автодополнение и проверку типов при
разработке скриптов на TypeScript.

## Проблема

При разработке скриптов для Moonloader возникают следующие проблемы:

- Отсутствие автодополнения функций API в редакторе
- Невозможность проверить корректность использования функций на этапе написания кода
- Отсутствие документации прямо в IDE
- Ошибки в именах функций и параметрах обнаруживаются только во время выполнения

## Решение

Этот пакет предоставляет полные TypeScript определения для всего Moonloader API, включая:

- Основные функции работы со скриптами
- Управление персонажами (Ped), транспортом (Vehicle), объектами (Object)
- События (onScriptTerminate, onFrame, onSendChat и т.д.)
- Потоки (lua_thread)
- Работу с ImGui, памятью, сетью (SAMP)
- Константы и enum'ы для типов пешеходов, оружия, погоды

## Установка

```bash
npm install @sentient-world/moonloader
```

## Использование

```typescript
import {
  wait,
  wasKeyPressed,
  getCharCoordinates,
  getCharHeading,
  print,
  PLAYER_PED,
} from '@sentient-world/moonloader';
import * as vkeys from 'vkeys';

function main() {
  while (true) {
    wait(0);

    if (wasKeyPressed(vkeys.VK_Y)) {
      const [x, y, z] = getCharCoordinates(PLAYER_PED);
      const angle = getCharHeading(PLAYER_PED);
      print(`x=${x}, y=${y}, z=${z}, angle=${angle}`);
    }
  }
}
```

## Особенности

### LuaMultiReturn

Функции, возвращающие несколько значений в Lua, используют тип `LuaMultiReturn`:

```typescript
const [x, y, z] = getCharCoordinates(ped);
const [found, targetPed] = findAllRandomCharsInSphere(x, y, z, 10, false, true);
```

### Symbol типы

Игровые сущности представлены как `Symbol` для типобезопасности:

```typescript
type Ped = Symbol;
type Vehicle = Symbol;
type Object = Symbol;
```

Это предотвращает случайное смешивание разных типов сущностей.

## Ссылки

- [Moonloader Wiki](https://wiki.blast.hk/ru/moonloader/scripting-api)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript To Lua Guide](https://typescripttolua.github.io/)

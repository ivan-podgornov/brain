# @brain/geometry

Набор базовых геометрических операций над точками на плоскости и в пространстве: расстояние между
точками, попадание в радиус и пошаговое перемещение к цели.

```ts
import { Geometry } from '@brain/geometry';

const geometry = new Geometry();

geometry.getDistance3d({ x: 0, y: 0, z: 0 }, { x: 2, y: 3, z: 6 }); // 7
```

## Точки

Точки описываются простыми объектами:

```ts
import type { Vector2, Vector3 } from '@brain/geometry';

const onMap: Vector2 = { x: 10, y: 20 };
const inWorld: Vector3 = { x: 10, y: 20, z: 5 };
```

Высота — это ось `z`, а плоскость `x`/`y` — земля. Поэтому любую `Vector3` можно передать туда, где
ожидается `Vector2`: высота в этом случае просто не учитывается.

## Расстояние между точками

`getDistance2d` измеряет расстояние по земле, `getDistance3d` — по прямой в пространстве:

```ts
const from = { x: 0, y: 0, z: 0 };
const to = { x: 3, y: 4, z: 12 };

geometry.getDistance2d(from, to); // 5
geometry.getDistance3d(from, to); // 13
```

Порядок аргументов не важен: расстояние от `from` до `to` и обратно всегда одинаковое.

## Попадание в радиус

`isWithinRadius2d` и `isWithinRadius3d` проверяют, находится ли точка не дальше заданного радиуса от
центра. Точка ровно на границе считается попавшей в радиус.

```ts
const door = { x: 0, y: 0, z: 0 };
const balcony = { x: 1, y: 1, z: 8 };

geometry.isWithinRadius2d(balcony, door, 2); // true — по земле балкон рядом
geometry.isWithinRadius3d(balcony, door, 2); // false — но он высоко
```

Какую из них выбрать, зависит от задачи. Если высота точек может немного различаться, а важно
только, дошёл ли кто-то до места, используйте `isWithinRadius2d`. Если высота имеет значение,
например, нужно отличать первый этаж от крыши, используйте `isWithinRadius3d`.

## Перемещение к цели

`moveTowards` возвращает новую точку, сдвинутую от текущей в сторону цели не больше чем на
`maxDistance`. Если до цели ближе, возвращается сама цель, так что точка никогда её не проскакивает.

```ts
const current = { x: 0, y: 0, z: 0 };
const target = { x: 10, y: 0, z: 0 };

geometry.moveTowards(current, target, 3); // { x: 3, y: 0, z: 0 }
geometry.moveTowards(current, target, 50); // { x: 10, y: 0, z: 0 }
```

Обычно `moveTowards` вызывают раз за раз, пока точка не дойдёт до цели. Шаг удобно считать как
скорость, умноженную на время, прошедшее с прошлого вызова, — тогда скорость движения не зависит от
того, как часто происходит вызов:

```ts
const speed = 1.5; // метров в секунду
let position = { x: 0, y: 0, z: 0 };

function update(deltaSeconds: number) {
  position = geometry.moveTowards(position, target, speed * deltaSeconds);
}
```

Переданные точки не изменяются: результат всегда новый объект.

## Зависимость от интерфейса

Если ваш класс использует геометрию, принимайте её через интерфейс `IGeometry`, а не создавайте
внутри. Так в тестах её можно подменить, а при необходимости — заменить реализацию целиком:

```ts
import type { IGeometry, Vector3 } from '@brain/geometry';

class Guard {
  constructor(
    private readonly geometry: IGeometry,
    private readonly post: Vector3
  ) {}

  isOnPost(position: Vector3): boolean {
    return this.geometry.isWithinRadius2d(position, this.post, 1);
  }
}

const guard = new Guard(new Geometry(), { x: 100, y: 200, z: 10 });
```

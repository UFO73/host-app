# Architecture

## Загальна схема

```text
Host UI
  -> Redux action
  -> listenerMiddleware
  -> MeasurementFlow
  -> ViewerBridgeClient
  -> window.postMessage
  -> ViewerBridge extension
  -> OHIF commandsManager

OHIF measurementService
  -> ViewerBridge extension
  -> window.postMessage
  -> ViewerBridgeClient
  -> MeasurementFlow
  -> Redux reducer
  -> selector
  -> Host UI
```

Застосунки працюють на різних origin:

- Host: `http://localhost:5173`;
- Viewer: `http://localhost:3000`.

## Відповідальність шарів

### Host UI

Показує measurement-рядки та dispatch-ить наміри користувача. UI не викликає `postMessage`.

### Redux

Зберігає тільки serializable domain state:

```text
waiting   { rowId }
drawing   { rowId }
completed { rowId, annotationId, area }
```

Totals не зберігаються у state, а обчислюються selector-ом окремо для кожної одиниці.

### listenerMiddleware і MeasurementFlow

`listenerMiddleware` реагує на Activate та Cancel. `MeasurementFlow` перетворює ці наміри на Redux events і виклики bridge.

### ViewerBridgeClient

Host transport відповідає за `postMessage`, `iframe.contentWindow`, перевірку origin/source, Zod-валідацію, handshake та command queue.

### ViewerBridge extension

Extension отримує `commandsManager` і `servicesManager` у `preRegistration`, активує OHIF tools та публікує measurement events у Host.

## Protocol

Кожне повідомлення має однакову оболонку:

```ts
{
  version: 1,
  type: string,
  payload: object
}
```

| Напрямок      | Type                  | Payload                                          | Призначення                     |
| ------------- | --------------------- | ------------------------------------------------ | ------------------------------- |
| Viewer → Host | `VIEWER_READY`        | `{}`                                             | Viewer готовий приймати команди |
| Host → Viewer | `ACTIVATE_TOOL`       | `{ rowId, toolName: 'EllipticalROI' }`           | Активувати еліпс для рядка      |
| Host → Viewer | `DEACTIVATE_TOOL`     | `{ rowId }`                                      | Скасувати очікування малювання  |
| Viewer → Host | `MEASUREMENT_ADDED`   | `{ rowId, annotationId, area: { value, unit } }` | Передати створене вимірювання   |
| Viewer → Host | `MEASUREMENT_UPDATED` | `{ rowId, annotationId, area: { value, unit } }` | Оновити площу зміненої анотації |

Приклад команди:

```json
{
  "version": 1,
  "type": "ACTIVATE_TOOL",
  "payload": {
    "rowId": "48bd...",
    "toolName": "EllipticalROI"
  }
}
```

Приклад результату:

```json
{
  "version": 1,
  "type": "MEASUREMENT_ADDED",
  "payload": {
    "rowId": "48bd...",
    "annotationId": "annotation-123",
    "area": {
      "value": 124.5,
      "unit": "mm²"
    }
  }
}
```

## Безпека повідомлень

Host приймає повідомлення тільки коли:

```text
event.origin === VITE_VIEWER_ORIGIN
event.source === iframe.contentWindow
```

Viewer приймає повідомлення тільки коли:

```text
event.origin === HOST_ORIGIN
event.source === window.parent
```

Після цього обидві сторони перевіряють структуру повідомлення через Zod.

## Прийняті рішення

### Хто створює ID

`rowId` створює Host через `crypto.randomUUID()` під час додавання рядка. Він існує до створення OHIF annotation, тому може бути переданий разом із `ACTIVATE_TOOL`.

`annotationId` створює OHIF. Viewer зберігає відповідність `annotationId -> rowId`, щоб подальший `MEASUREMENT_UPDATED` потрапив у правильний рядок.

`requestId` не використовується, оскільки актуальний Viewer protocol корелює операцію через `rowId`.

### Handshake

Viewer надсилає `VIEWER_READY` після готовності viewport. До цього Host не надсилає команди у `iframe`.

### Команди, які прийшли зарано

Якщо користувач натиснув Activate до `VIEWER_READY`, `ViewerBridgeClient` зберігає команду у внутрішній пам'яті. Після handshake `flushQueue()` надсилає всі відкладені команди в порядку додавання.

Черга та ready-state не зберігаються в Redux, оскільки це transport state.

### Відсутність echo-циклу

Host не надсилає measurement value назад у Viewer. Напрямки розділені:

- Host надсилає тільки tool-команди;
- Viewer надсилає тільки readiness і measurement events.

`MEASUREMENT_UPDATED` змінює Redux state та UI, але не створює новий bridge command, тому цикл `Host -> Viewer -> Host -> Viewer` не виникає.

### Одиниці вимірювання

Viewer передає одиницю разом зі значенням. Host групує totals за unit, тому `mm²` і `px²` не додаються одне до одного.

### Чому два contract-файли

Viewer і Host є незалежними репозиторіями та збираються різними toolchain. Для простого тестового каркаса однаковий невеликий Zod contract зберігається в кожному репозиторії. При розширенні protocol його варто винести в окремий shared package.

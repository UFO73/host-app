# Architecture

## Загальна схема

```text
Host UI
  -> Redux action
  -> listenerMiddleware
  -> ViewerBridgeClient
  -> window.postMessage
  -> ViewerBridge extension
  -> OHIF commandsManager

OHIF measurementService
  -> ViewerBridge extension
  -> window.postMessage
  -> ViewerBridgeClient
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
waiting   { rowId, toolName }
drawing   { rowId, toolName }
completed { rowId, annotationId, toolName, metric }
```

Totals не зберігаються у state, а обчислюються selector-ом окремо для кожної одиниці.

### listenerMiddleware

`listenerMiddleware` є orchestration layer: реагує на дії UI, викликає bridge та dispatch-ить domain events. Події від ViewerBridgeClient також перетворюються тут на Redux actions.

### ViewerBridgeClient

Host transport відповідає за `postMessage`, `iframe.contentWindow`, перевірку origin/source, Zod-валідацію, handshake та command queue.

### ViewerBridge extension

Extension отримує `commandsManager` і `servicesManager` у `preRegistration`, активує OHIF tools та публікує measurement events у Host.

## Bridge API

Повний список повідомлень, напрямків і payload описаний у [BRIDGE-CONTRACT.md](./BRIDGE-CONTRACT.md).

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

### Handshake

Host повторює `REQUEST_VIEWER_READY`, доки Viewer не відповість `VIEWER_READY`. Viewer відповідає тільки після готовності viewport, тому порядок завантаження застосунків не має значення. До завершення handshake Host не надсилає tool-команди у `iframe`.

### Команди, які прийшли зарано

Якщо користувач натиснув Activate до `VIEWER_READY`, `ViewerBridgeClient` зберігає команду у внутрішній пам'яті. Після handshake `flushQueue()` надсилає всі відкладені команди в порядку додавання.

Черга та ready-state не зберігаються в Redux, оскільки це transport state.

### Відновлення після перезавантаження

Host зберігає measurement rows у своєму `sessionStorage` окремо для кожного `StudyInstanceUID` та передає їх у Redux через `preloadedState`. Рядок зі статусом `drawing` відновлюється як `waiting`, оскільки незавершене малювання не можна продовжити після reload.

Viewer окремо зберігає Cornerstone annotation snapshots у своєму `sessionStorage` за тим самим `StudyInstanceUID`. Перед `VIEWER_READY` extension відновлює лише анотації, `referencedImageId` яких належить поточному display set, і повертає зв'язок `annotationId -> rowId`. Завдяки цьому після reload продовжують працювати update, focus і delete, а анотації іншого дослідження не потрапляють у поточний Viewer.

Нові protocol messages для persistence не потрібні: кожен застосунок відновлює власний state до початку звичайного bridge flow.

### Відсутність echo-циклу

Host не надсилає measurement value назад у Viewer. Напрямки розділені:

- Host надсилає тільки tool-команди;
- Viewer надсилає тільки readiness і measurement events.

`MEASUREMENT_UPDATED` змінює Redux state та UI, але не створює новий bridge command, тому цикл `Host -> Viewer -> Host -> Viewer` не виникає.

`MEASUREMENT_REMOVED` також змінює тільки Redux state. Host не надсилає у відповідь ще одну команду видалення.

Після натискання `Видалити` Host не прибирає рядок оптимістично. Рядок залишається у Redux до підтвердження `MEASUREMENT_REMOVED` від Viewer.

### Cleanup

Host підключає `window.message` listener під час mount і видаляє його під час unmount. Viewer у `onModeExit` видаляє listener, відписується від OHIF services і скидає активний інструмент у Pan. Під час наступного `onModeEnter` bridge створюється знову.

### Одиниці вимірювання

Viewer передає одиницю разом зі значенням. Host групує totals за unit, тому `mm²` і `px²` не додаються одне до одного.

### Чому два contract-файли

Viewer і Host є незалежними репозиторіями та збираються різними toolchain. Для простого тестового каркаса однаковий невеликий Zod contract зберігається в кожному репозиторії. При розширенні protocol його варто винести в окремий shared package.

# Viewer + Scoring Form

Два окремі застосунки спілкуються через `window.postMessage`:

- `viewer` — форк OHIF із власним bridge extension;
- `host-app` — React-форма з OHIF у `iframe`.

## Вимоги

- Git;
- Node.js 22 LTS;
- Corepack;
- браузер Chrome, Edge або Firefox.

Node 22 рекомендований, оскільки актуальні Vite і Vitest у `host-app` потребують новішої версії Node 20.

## Клонування

Клонуйте обидва репозиторії у зручні для вас директорії:

```bash
git clone https://github.com/UFO73/viewer.git
git clone https://github.com/UFO73/host-app.git
```

Їхнє розташування у файловій системі не має значення: застосунки спілкуються через HTTP і `window.postMessage`.

## Запуск Viewer

Відкрийте перший термінал:

```bash
cd /path/to/viewer
corepack enable
corepack prepare yarn@1.22.22 --activate
yarn install --frozen-lockfile
cp platform/app/.env.example platform/app/.env
yarn dev
```

Viewer буде доступний на [http://localhost:3000](http://localhost:3000).

Локальний env Viewer містить:

```dotenv
PUBLIC_URL=/
APP_CONFIG=config/default.js
USE_HASH_ROUTER=false
HOST_ORIGIN=http://localhost:5173
```

`HOST_ORIGIN` визначає єдиний origin, від якого Viewer приймає bridge-команди.

## Запуск Host

Відкрийте другий термінал:

```bash
cd /path/to/host-app
corepack enable
corepack prepare pnpm@10.15.1 --activate
pnpm install --frozen-lockfile
cp .env.example .env
pnpm dev
```

Відкрийте [http://localhost:5173](http://localhost:5173).

Host автоматично відкриє Viewer у `iframe` за URL із `.env`:

```dotenv
VITE_VIEWER_ORIGIN=http://localhost:3000
VITE_VIEWER_URL=http://localhost:3000/viewer?StudyInstanceUIDs=...
```

## Робочий сценарій

1. Дочекайтеся завантаження DICOM-дослідження у Viewer.
2. Натисніть `Додати вимірювання`.
3. Натисніть `Активувати` у створеному рядку.
4. Намалюйте еліпс у Viewer.
5. Рядок отримає площу та статус `Готово`.
6. Зміна еліпса у Viewer оновить площу й загальну суму.

Під час малювання кнопка `Скасувати` вимикає інструмент і повертає рядок у стан очікування.

## Перевірки

Host:

```bash
pnpm build
pnpm lint
pnpm format:check
pnpm test
```

Viewer:

```bash
yarn build
```

## Конфігурація

Якщо порти змінюються, значення мають збігатися з реальними адресами:

- `host-app/.env`: `VITE_VIEWER_ORIGIN` і `VITE_VIEWER_URL`;
- `viewer/platform/app/.env`: `HOST_ORIGIN`.

Bridge навмисно використовує точні origin, а не `*`.

## Документація

- [ARCHITECTURE.md](./ARCHITECTURE.md) — protocol, handshake та прийняті рішення;

# Viewer + Scoring Form

Два окремі застосунки спілкуються через `window.postMessage`:

- `viewer` — форк OHIF із власним bridge extension;
- `host-app` — React-форма з OHIF у `iframe`.

## Вимоги

- Git;
- Node.js 22 LTS;
- Corepack;

## Клонування

Клонуйте обидва репозиторії у зручні для вас директорії:

```bash
git clone https://github.com/UFO73/viewer.git
git clone https://github.com/UFO73/host-app.git
```

Їхнє розташування у файловій системі не має значення: застосунки спілкуються через HTTP і `window.postMessage`.

## Запуск Viewer

Відкрийте термінал:

```bash
cd /path/to/viewer
corepack yarn install --frozen-lockfile
cp platform/app/.env.example platform/app/.env
corepack yarn workspace @ohif/app dev
```

Viewer буде доступний на [http://localhost:3000](http://localhost:3000).

`HOST_ORIGIN` визначає єдиний origin, від якого Viewer приймає bridge-команди.

## Запуск Host

Відкрийте термінал:

```bash
cd /path/to/host-app
corepack pnpm install --frozen-lockfile
cp .env.example .env
corepack pnpm dev
```

Відкрийте [http://localhost:5173](http://localhost:5173).

Host автоматично відкриє Viewer у `iframe` за URL із `.env`:

```dotenv
VITE_VIEWER_ORIGIN=http://localhost:3000
VITE_VIEWER_URL=http://localhost:3000/viewer?StudyInstanceUIDs=...
```

## Перевірки

Host:

```bash
corepack pnpm build
corepack pnpm lint
corepack pnpm format:check
```

Viewer:

```bash
NODE_ENV=production corepack yarn workspace @ohif/app build
```

## Конфігурація

Якщо порти змінюються, значення мають збігатися з реальними адресами:

- `host-app/.env`: `VITE_VIEWER_ORIGIN` і `VITE_VIEWER_URL`;
- `viewer/platform/app/.env`: `HOST_ORIGIN`.

Bridge навмисно використовує точні origin, а не `*`.

## Документація

- [ARCHITECTURE.md](./ARCHITECTURE.md) — архітектурний flow і прийняті рішення;
- [BRIDGE-CONTRACT.md](./BRIDGE-CONTRACT.md) — API bridge-повідомлень;
- [AI-USAGE.md](./AI-USAGE.md) — як у проєкті використовувався AI.

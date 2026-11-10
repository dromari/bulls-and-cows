# Bulls and Cows — Design Document

## Структуры данных

### Состояние игры

Состояние описывается типом `GameState` (`src/core/gameState.ts`):

```typescript
type GameSettings = { length: number; base: number };

type GameHistoryEntry = {
  guess: string;
  bulls: number;
  cows: number;
};

type GameStatus = 'idle' | 'playing' | 'won';

type GameState = {
  settings: GameSettings;
  secret: string;
  history: GameHistoryEntry[];
  startTime: number;
  status: GameStatus;
};
```

- `settings` неизменны в течение раунда.
- `secret` генерируется при старте и хранится как строка, чтобы корректно обрабатывать лидирующие нули (например, `"0123"`).
- `history` — иммутабельный массив записей. Новая попытка создаёт новый массив `[...history, entry]` в `makeGuess`.
- `startTime` — метка времени начала раунда в миллисекундах.
- `status` — конечный автомат из трёх состояний.

### Таблица рекордов

Запись рекорда (`src/storage/records.ts`):

```typescript
type LeaderboardRecord = {
  length: number;
  base: number;
  attempts: number;
  time: number;
  date: string;
};
```

Все рекорды хранятся в `localStorage` единым JSON-массивом по ключу `bulls-and-cows-records`. В каждой записи явно сохраняются настройки раунда (`length`/`base`), поэтому таблица может быть общей для всех комбинаций настроек — на экране отображается либо топ по текущим настройкам, либо общий топ с бейджем настроек.

## Алгоритмы

### `generateSecret(length, base, random)`

1. Проверяются граничные условия (`length >= 0`, `length <= base`).
2. Создаётся пул допустимых символов — срез строки `"0123456789abcdef"` длиной `base`.
3. `length` раз выполняется:
   - случайный индекс в текущем пуле;
   - извлечение символа методом `splice` (удаление из пула гарантирует уникальность);
   - добавление символа к результату.

Сложность: O(length × base) по времени (каждый `splice` работает за O(base)) и O(base) по памяти на пул плюс O(length) на результат.

### `evaluateGuess(secret, guess)`

1. Обе строки приводятся к нижнему регистру и разбиваются на массивы символов.
2. **bulls**: `filter` по индексу, считается количество позиций, где символы совпадают.
3. **cows**: строится множество уникальных символов из обоих массивов. Для каждого символа `reduce` считает `min(количество в secret, количество в guess)` — это общее число совпадающих цифр без учёта позиции. Cows = это число минус bulls.

Сложность: O(n²) по времени в худшем случае, где n = length, из-за вложенных проходов по массивам внутри `reduce`/`filter`. Память: O(n).

### `isValidGuess(guess, length, base)`

1. Проверка длины.
2. Нормализация строки к нижнему регистру.
3. Проверка каждого символа через каррированный валидатор `createDigitValidator(base)` методом `every`.
4. Проверка уникальности через сравнение размера `Set` с длиной строки.

Сложность: O(length) по времени и памяти. Создание валидатора занимает O(base), но выполняется один раз за вызов.

### `countPossibleSecrets(length, base)`

Количество перестановок без повторений: P(base, length) = base! / (base − length)!.

Реализовано рекурсивно:

```text
countPossibleSecrets(length, base) = base * countPossibleSecrets(length - 1, base - 1)
```

Базовые случаи:

- `length === 0` → 1
- `length === 1` → base

Результаты кэшируются в `Map` по паре `(length, base)`, поэтому каждая уникальная пара вычисляется один раз.

Сложность с мемоизацией: O(length) по времени и памяти для одного вызова (для фиксированных `length` и `base` вычисляется ровно `length` состояний).

## Принципы чистого кода

### Чистые функции и отсутствие побочных эффектов

Вся игровая логика в `src/core/` — чистые функции без DOM-зависимостей. Например, `generateSecret`, `evaluateGuess`, `isValidGuess`, `countPossibleSecrets` и хелперы состояния (`createGameState`, `startGame`, `makeGuess`) не мутируют входные данные.

### Иммутабельность

- `makeGuess` возвращает новое состояние с `history: [...state.history, entry]` (`src/core/gameState.ts`).
- `addRecord` возвращает `records: [...records, record]` (`src/storage/records.ts`).
- Исходные массивы и объекты никогда не изменяются.

### Функции высшего порядка, каррирование и мемоизация

- `evaluateGuess` использует только методы массивов: `split`, `filter`, `reduce` (`src/core/evaluateGuess.ts`).
- `createDigitValidator(base)` возвращает предикат `(char) => boolean`, который переиспользуется в `isValidGuess` и в обработчике ввода на экране игры (`src/core/createDigitValidator.ts`, `src/ui/renderGame.ts`).
- `countPossibleSecrets` мемоизирован через замыкание с `Map` (`src/core/countPossibleSecrets.ts`).

### Единая ответственность

- `src/core/` — только игровая логика.
- `src/ui/` — только рендеринг и обработка пользовательских событий.
- `src/storage/` — только работа с `localStorage`.
- `src/main.ts` — связывает слои через замыкание состояния.

### Безопасная работа с DOM

В UI нет `innerHTML`/`insertAdjacentHTML`. Вся разметка создаётся через `document.createElement` и `document.createTextNode` в хелпере `createElement` (`src/ui/createElement.ts`).

### Типизация

Используется строгий режим TypeScript (`strict: true`). Все публичные функции ядра имеют явные типы параметров и возвращаемых значений. Запрещён `any` (`@typescript-eslint/no-explicit-any: error`).

## Сложность функций ядра

| Функция                | Время             | Память    | Примечание                                   |
| ---------------------- | ----------------- | --------- | -------------------------------------------- |
| `generateSecret`       | O(length × base)  | O(base)   | `splice` в пуле стоит O(base)                |
| `evaluateGuess`        | O(n²), n = length | O(n)      | Вложенные проходы по массивам                |
| `isValidGuess`         | O(length)         | O(length) | Включая нормализацию и проверку уникальности |
| `countPossibleSecrets` | O(length)         | O(length) | Благодаря мемоизации                         |

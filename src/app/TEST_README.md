# Tests

Tests and the Vitest configuration are under `src/app`.

## Setup

Install project dependencies from the project root:

```sh
npm install
```

## Run

Run Vitest from `src/app`, where its configuration is located:

```sh
cd src/app
npx vitest run
```

For watch mode, omit `run`:

```sh
npx vitest
```

The root `package.json` does not define test scripts; `jsdom` is included as a development dependency for the configured test environment.

## Layout

- `src/app/components/__tests__/` contains component tests.
- `src/app/utils/__tests__/` contains utility tests.
- `src/app/src/test/setup.ts` configures Testing Library cleanup and browser API mocks.

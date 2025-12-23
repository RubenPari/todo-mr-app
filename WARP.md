# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project overview

This repository is a basic [NestJS](https://nestjs.com) TypeScript starter for a Node.js HTTP API. The application is bootstrapped from `src/main.ts`, which creates a Nest application using the root `AppModule` and listens on `process.env.PORT` or port `3000`.

The root `AppModule` wires together controllers and providers for the app. Currently it registers a single `AppController` and `AppService`, but this is where additional feature modules should be imported as the project grows.

The `AppController` exposes an HTTP GET handler for the root path `/`. That handler delegates to `AppService.getHello()`, which encapsulates the (currently trivial) business logic.

Unit tests live alongside source files under `src` (for example, `src/app.controller.spec.ts` for `AppController`) and use Nest's `TestingModule` utilities. End-to-end tests live under `test/` (for example, `test/app.e2e-spec.ts`) and spin up a real Nest application instance, asserting behavior via `supertest` against the HTTP server.

## Commands

All commands are intended to be run from the repository root.

### Dependency installation

```bash
npm install
```

### Build

Compile the TypeScript source to JavaScript in `dist/` using the Nest CLI:

```bash
npm run build
```

### Run the application

Development server with file watching:

```bash
npm run start:dev
```

Run once in development mode (no watch):

```bash
npm run start
```

Run the compiled production build (expects prior `npm run build`):

```bash
npm run start:prod
```

The HTTP server listens on `process.env.PORT` if set, otherwise on port `3000`.

### Linting and formatting

Run ESLint over the main source and test directories (auto-fixing where possible):

```bash
npm run lint
```

Format TypeScript source and tests with Prettier:

```bash
npm run format
```

### Tests

Run the Jest unit test suite (tests under `src` matching `*.spec.ts`):

```bash
npm test
```

Watch unit tests and re-run on file changes:

```bash
npm run test:watch
```

Run unit tests with coverage reporting (output to `coverage/`):

```bash
npm run test:cov
```

Debug Jest tests with Node's inspector attached:

```bash
npm run test:debug
```

Run the end-to-end (e2e) test suite (tests under `test/` using `test/jest-e2e.json`):

```bash
npm run test:e2e
```

Run a single Jest test file or filtered test from the CLI, using Jest's built-in pattern matching. For example, to run only the `app.controller` unit tests:

```bash
npm test -- app.controller.spec.ts
```

or to run tests whose names match a given substring (e.g., all tests mentioning `root`):

```bash
npm test -- -t root
```

## TypeScript configuration

The TypeScript compiler is configured via `tsconfig.json` to:

- Use `nodenext` module and module resolution settings suitable for modern Node.js.
- Target `ES2023`, emitting compiled JavaScript into `dist/`.
- Enable NestJS-related decorator options (`emitDecoratorMetadata`, `experimentalDecorators`).
- Use stricter type-checking defaults (such as `strictNullChecks` and `skipLibCheck`) while allowing `noImplicitAny` and some other strict flags to be relaxed.

When adding new source files, keep them under `src/` so they are picked up by both `tsc` (via `nest build`) and Jest.

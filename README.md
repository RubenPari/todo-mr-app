<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

A simple REST API for managing users and their tasks (to-do list). Built with **NestJS**, **TypeScript**, **MySQL**, and **Sequelize ORM**. Includes authentication with JWT, input validation, Swagger documentation, Docker support, and comprehensive test coverage.

### Technology Stack

- **Framework**: [NestJS](https://nestjs.com) — Progressive Node.js framework for building scalable server applications
- **ORM**: [Sequelize](https://sequelize.org) with [sequelize-typescript](https://github.com/sequelize/sequelize-typescript)
  - **Why Sequelize?** Mature, well-documented ORM with strong TypeScript support, excellent for relational databases, familiar API, and seamless integration with NestJS via `@nestjs/sequelize`
- **Database**: MySQL 8.0 (configurable via environment variables)
- **Authentication**: JWT with Passport.js
- **Validation**: `class-validator` + `class-transformer` with global ValidationPipe
- **API Documentation**: Swagger/OpenAPI on `/api`
- **Containerization**: Docker + Docker Compose with multi-stage builds
- **Testing**: Jest unit tests and end-to-end tests with Supertest
- **Password hashing**: bcrypt (salted + hashed passwords, never stored in plaintext)

## Project setup

```bash
npm install
```

## Compile and run the project

```bash
# development (watch mode)
npm run start:dev

# development (no watch)
npm run start

# production (requires build first)
npm run build
npm run start:prod
```

The HTTP server listens on `process.env.PORT` if set, otherwise on port `3000`.

### Database configuration (MySQL + Sequelize)

Configure via environment variables (defaults work with docker-compose):

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `DB_USER` (default: `root`)
- `DB_PASSWORD` (default: `password`)
- `DB_NAME` (default: `todo_app`)

On application startup, all models are automatically synced (`synchronize: true` in development).

## API Features

### Authentication (JWT-based)

- **Registration**: `POST /auth/register` — Create a new user account
- **Login**: `POST /auth/login` — Get a JWT access token
- **Profile**: `GET /auth/me` (protected) — Retrieve authenticated user's profile

### Users (Admin endpoints - available without authentication)

- `POST /users` — Create a user
- `GET /users` — List all users
- `GET /users/:id` — Get user details
- `PATCH /users/:id` — Update a user
- `DELETE /users/:id` — Delete a user

### Tasks (Protected by JWT - only accessible with valid token)

All authenticated task operations are under `/me/tasks`:

- `POST /me/tasks` — Create a task for authenticated user
- `GET /me/tasks` — List all tasks of authenticated user
- `GET /me/tasks/:id` — Get a specific task (only if owned by authenticated user)
- `PATCH /me/tasks/:id` — Update a task (only if owned by authenticated user)
- `DELETE /me/tasks/:id` — Delete a task (only if owned by authenticated user)

### Example requests

**Register & Login**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"SecurePass123"}'

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

**Create task (authenticated)**:
```bash
curl -X POST http://localhost:3000/me/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk and bread","completed":false}'
```

### Validation & Error Handling

- Input validation via `class-validator` decorators on all DTOs
- ValidationPipe configuration:
  - `whitelist: true` — Strips unknown properties
  - `forbidNonWhitelisted: true` — Rejects requests with unknown properties
  - `transform: true` — Auto-converts primitive types (e.g., string IDs → numbers)
- Proper HTTP error codes (400 for validation, 401 for auth, 404 for not found, 409 for conflicts)

### Swagger/OpenAPI Documentation

Interactive API documentation available at:

```
http://localhost:3000/api
```

Use Swagger UI to test all endpoints interactively.

### Postman Collection

A complete Postman collection is provided in `postman/todo-mr.postman_collection.json`. Import it into Postman and set the `baseUrl` variable to `http://localhost:3000`.

## Run tests

```bash
# Unit tests
npm run test

# Unit tests (watch mode)
npm run test:watch

# Unit tests with coverage
npm run test:cov

# End-to-end tests (requires running DB)
npm run test:e2e
```

### Testing Strategy

- **Unit Tests**: Service logic with mocked dependencies (in `src/**/*.spec.ts`)
- **E2E Tests**: Full HTTP requests against a real NestJS application instance (in `test/**/*.e2e-spec.ts`)
- Tests use a fresh database instance for each test (synchronized automatically)
- 8 test cases covering:
  - User registration with duplicate email detection
  - JWT login and profile retrieval
  - Full CRUD on authenticated tasks
  - Input validation and field whitelisting
  - Access control (users can only see their own tasks)

## Docker & Docker Compose

### Build the container

```bash
docker compose build
```

### Run with Docker Compose

```bash
docker compose up -d
```

This starts:
- **MySQL** database on port 3307
- **NestJS app** on port 3000

The app will automatically sync the database schema on startup.

### View logs

```bash
docker compose logs -f app
```

### Stop services

```bash
docker compose down
```

### Container architecture

The `Dockerfile` uses a two-stage build:

1. **Build stage**: Installs all dependencies and compiles TypeScript
2. **Runtime stage**: Uses only production dependencies and the compiled dist folder

This reduces the final image size significantly.

## Code Structure & Architecture

```
src/
├── auth/                    # Authentication module (JWT, passport, login/register)
│   ├── auth.controller.ts   # Register, login, profile endpoints
│   ├── auth.service.ts      # Password validation, JWT signing
│   ├── jwt.strategy.ts      # Passport JWT strategy
│   ├── jwt.guard.ts         # @UseGuards(JwtAuthGuard) protection
│   ├── auth.module.ts
│   └── dto/login.dto.ts
├── users/                   # User management module
│   ├── users.controller.ts  # User CRUD endpoints
│   ├── users.service.ts     # User business logic & password hashing
│   ├── user.model.ts        # Sequelize model
│   ├── users.module.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── tasks/                   # Task management module
│   ├── tasks.controller.ts  # Admin task endpoints (public)
│   ├── me.tasks.controller.ts # Protected endpoints (/me/tasks)
│   ├── tasks.service.ts     # Task business logic
│   ├── task.model.ts        # Sequelize model with FK to users
│   ├── tasks.module.ts
│   └── dto/
│       ├── create-task.dto.ts
│       └── update-task.dto.ts
├── app.module.ts            # Root module (Sequelize config, imports)
└── main.ts                  # Application bootstrap, ValidationPipe setup, Swagger config

test/
├── app.e2e-spec.ts          # E2E tests for auth & full workflows
├── auth.e2e-spec.ts         # E2E tests for authentication
├── tasks.e2e-spec.ts        # E2E tests for task CRUD
├── jest-e2e.json            # Jest config for e2e tests
└── jest-e2e-setup.ts
```

### Design Patterns & Principles

1. **Modular Architecture**: Separate modules for auth, users, and tasks with clear boundaries
2. **Service Layer**: Business logic encapsulated in services, controllers handle HTTP
3. **Dependency Injection**: NestJS IoC container for loose coupling
4. **Repository-like Pattern**: Services wrap ORM operations
5. **DTO Pattern**: Request/response shape validation with `class-validator`
6. **Global Exception Handling**: NestJS built-in exception filters for consistent error responses
7. **Stateless Authentication**: JWT tokens allow horizontal scaling without session storage

## Key Implementation Decisions

### Why this architecture?

1. **NestJS + Sequelize**: Enterprise-grade Node.js stack with excellent TypeScript support, testing utilities, and middleware ecosystem. Sequelize is mature and well-integrated.

2. **JWT over Sessions**: Stateless authentication enables easy horizontal scaling and works well with containerized environments. Tokens are signed and verified server-side.

3. **Protected `/me/tasks` endpoints**: Separate controllers for admin CRUD (`/users/:id/tasks`) vs authenticated user operations (`/me/tasks`). This ensures users can only manage their own tasks through explicit authorization checks.

4. **Bcrypt for passwords**: Industry-standard salted hashing. Never store plain-text passwords. Bcrypt is slow-by-design (10 salt rounds) to resist brute-force attacks.

5. **Global ValidationPipe**: Centralized input validation across all endpoints. Prevents invalid data from reaching business logic.

6. **Swagger/OpenAPI**: Auto-generated from decorators (@ApiProperty, @ApiTags). Easy to keep docs in sync with code.

7. **Docker multi-stage builds**: Reduces image size by excluding dev dependencies and build artifacts from runtime layer.

8. **Database auto-sync**: `synchronize: true` is convenient for development; production would use migrations (e.g., with `sequelize-cli`).

## Performance & Production Considerations

### For production deployments:

1. **Environment Configuration**: Use `.env` files or secret management (AWS Secrets Manager, HashiCorp Vault)
2. **Database Migrations**: Replace `synchronize: true` with explicit migrations to maintain schema history
3. **Connection Pooling**: Configure `Sequelize.connectionManager.pool` for MySQL connection reuse
4. **Rate Limiting**: Add `@nestjs/throttler` to prevent brute-force attacks
5. **Logging**: Replace console.log with structured logging (Winston, Bunyan)
6. **Monitoring**: Integrate Application Performance Monitoring (APM) like New Relic or Datadog
7. **Security**:
   - Enable HTTPS/TLS
   - Use environment-specific secrets
   - Implement CORS appropriately
   - Add helmet.js for HTTP security headers
   - Validate JWT expiration

### Database Optimization:

- Add database indices on frequently queried columns (e.g., `users.email`, `tasks.userId`)
- Consider caching strategy for frequently accessed data (Redis)
- Profile slow queries with MySQL's `slow_query_log`

## Linting & Formatting

```bash
# Run ESLint with auto-fix
npm run lint

# Format code with Prettier
npm run format
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Sequelize Documentation](https://sequelize.org)
- [Passport.js JWT Strategy](http://www.passportjs.org/packages/passport-jwt/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Docker Documentation](https://docs.docker.com)
- [Jest Testing Framework](https://jestjs.io)

---

**License**: UNLICENSED (update as needed)

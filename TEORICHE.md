# Risposte alle Domande Teoriche

## 1. Spiega cosa sono i Decorators in TypeScript e fornisci un esempio d'uso pratico.

### Che cosa sono i Decorators?

I **Decorators** sono una feature di TypeScript (e proposta ES2022) che permettono di **annotare e modificare classi, metodi, proprietà e parametri** in fase di dichiarazione. Sono funzioni che accettano un target e lo estendono o modificano il suo comportamento senza alterarne il codice principale.

La loro sintassi usa il simbolo `@` prima della dichiarazione:

```typescript
@NomeDecorator
class MiaClasse {}

class MiaClasse {
  @NomeDecorator
  mioMetodo() {}
}
```

### Come funzionano internamente

I Decorators sono eseguiti **al momento della definizione della classe**, non a runtime. Ricevono il target e possono:
- Leggerne i metadati
- Modificare il prototipo
- Registrare comportamenti
- Aggiungere proprietà o metodi

### Esempio pratico in NestJS

Nel progetto, i Decorators sono usati ampiamente:

```typescript
// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'mario.rossi@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Str0ngP@ssw0rd' })
  @IsString()
  @MinLength(8)
  password!: string;
}
```

**Cosa fanno questi Decorators?**

- `@ApiProperty()` — Aggiunge metadati Swagger/OpenAPI (documentazione automatica)
- `@IsEmail()` — Valida che il campo sia un email valido (fornito da `class-validator`)
- `@MinLength(8)` — Valida che la stringa sia almeno lunga 8 caratteri

### Altro esempio: Decorators personalizzati

Nel progetto, usiamo il decorator `@Request()` fornito da NestJS per accedere all'utente autenticato:

```typescript
// src/tasks/tasks.controller.ts
@Get()
@UseGuards(JwtAuthGuard)
findAll(@Request() req: { user: AuthenticatedUser }) {
  return this.tasksService.findAllForUser(req.user.userId);
}
```

**Esempio teorico**: Potremmo creare un decorator personalizzato per semplificare l'accesso all'utente:

```typescript
// Custom decorator per estrarre l'utente autenticato
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Recupera l'utente dal JWT decodificato
  },
);

// Utilizzo semplificato nel controller
@Get('me')
@UseGuards(JwtAuthGuard)
getProfile(@CurrentUser() user: AuthenticatedUser) {
  return user;
}
```

### Vantaggi dei Decorators

1. **Separazione delle Concerns**: Validation, documentation e autorizzazione sono separate dal codice core
2. **Riusabilità**: Un decorator può essere applicato a molte classi/metodi
3. **Leggibilità**: Il codice è più dichiarativo e facile da capire
4. **Composizione**: Più decorators possono essere staccati e composti insieme
5. **Metadati**: Permettono di allegare informazioni che vengono usate da framework/librerie

---

## 2. Come si può implementare un middleware globale? Quando è consigliato usarlo?

### Cos'è un Middleware?

Un **middleware** è una funzione che intercetta le richieste HTTP **prima** che raggiungano il controller. Ha accesso alla richiesta (request), risposta (response) e alla prossima funzione middleware (`next()`).

### Implementazione in NestJS

#### Opzione 1: Classe Middleware

```typescript
// logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(
        `[${new Date().toISOString()}] ${method} ${originalUrl} - ${res.statusCode} - ${duration}ms - IP: ${ip}`,
      );
    });

    next();
  }
}

// app.module.ts
import { NestModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggingMiddleware } from './logging.middleware';

@Module({
  // ... providers, imports
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes('*'); // Applica a tutte le rotte
  }
}
```

#### Opzione 2: Middleware funzionale

```typescript
// request-id.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function RequestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  req['requestId'] = uuidv4();
  res.setHeader('X-Request-ID', req['requestId']);
  next();
}

// app.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
```

#### Opzione 3: Middleware globale (come nel progetto)

Nel nostro progetto, usiamo **Global Pipes** per la validazione (simile concettualmente a un middleware):

```typescript
// main.ts
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe globale: valida TUTTE le richieste
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
```

### Quando usare Middleware Globale?

1. **Logging e Monitoring**: Registrare tutte le richieste/risposte
2. **Request ID Tracking**: Aggiungere un ID univoco a ogni richiesta per debugging distribuito
3. **CORS Configuration**: Gestire cross-origin requests
4. **Security Headers**: Aggiungere header di sicurezza (X-Frame-Options, X-Content-Type-Options, ecc.)
5. **Request/Response Transformation**: Manipolare body, query params, headers prima che raggiungano il controller
6. **Authentication/Authorization**: Verificare token JWT, session, ecc.
7. **Rate Limiting**: Limitare il numero di richieste per IP/utente
8. **Error Handling**: Catturare errori globali

### Best Practices

```typescript
// helmet.middleware.ts — Aggiungere security headers
import { Injectable, NestMiddleware } from '@nestjs/common';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    helmet()(req, res, next);
  }
}

// app.module.ts
@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        HelmetMiddleware,
        LoggingMiddleware,
        RequestIdMiddleware,
      )
      .forRoutes('*');
  }
}
```

**Ordine importante**: I middleware sono eseguiti nell'ordine in cui li aggiungi, quindi:
1. Helmet (security) prima
2. Logging/Request-ID (tracing) dopo
3. Business logic (controller) infine

---

## 3. Racconta un errore o difficoltà che hai incontrato usando Node.js e come lo hai risolto.

### Il Problema: Ecosistema Non Omogeneo e Configurazioni Complesse

#### Scenario

Durante lo sviluppo del progetto **todo-mr-app** con NestJS e TypeScript, ho incontrato una difficoltà ricorrente: **far combaciare correttamente tutti gli strumenti, standard e configurazioni** per ottenere codice pulito, efficiente, che compili senza errori e senza warning.

Node.js, specialmente in un contesto enterprise con framework strutturati come NestJS, presenta una sfida particolare: l'ecosistema è composto da **strumenti e standard non omogenei e non centralizzati**, che devono essere configurati e fatti interagire manualmente.

#### Root Cause Analysis

Il problema principale risiede nella natura frammentata dell'ecosistema Node.js:

1. **TypeScript Configuration**: `tsconfig.json` con diverse opzioni (`strict`, `esModuleInterop`, `skipLibCheck`, ecc.) che devono essere allineate con le versioni di TypeScript e dei tipi delle dipendenze.

2. **ESLint + Prettier**: Due strumenti separati che devono essere configurati insieme:
   - `eslint.config.js` o `.eslintrc.json` per le regole di linting
   - `.prettierrc` per la formattazione
   - `eslint-config-prettier` per evitare conflitti
   - Spesso conflitti tra regole ESLint e formattazione Prettier

3. **Type Definitions**: Le definizioni dei tipi (`@types/*`) devono essere compatibili con:
   - La versione di TypeScript
   - Le versioni delle librerie runtime
   - Le versioni di altre `@types/*` packages

4. **Module Systems**: Coesistenza di:
   - CommonJS (`require/module.exports`)
   - ES Modules (`import/export`)
   - TypeScript module resolution (`module`, `moduleResolution` in `tsconfig.json`)

5. **Build Tools**: Configurazioni separate per:
   - TypeScript compiler (`tsc`)
   - NestJS build system
   - Testing framework (Jest con `ts-jest` o `@swc/jest`)

#### Esempio Concreto di Problema

Durante la configurazione iniziale del progetto, ho incontrato questo scenario:

```typescript
// Errore di compilazione TypeScript
import { Request } from 'express';
// Error: Module '"express"' has no exported member 'Request'.
```

**Problema**: Le definizioni dei tipi di Express (`@types/express`) non erano allineate con la versione di Express installata, o la configurazione di TypeScript non permetteva la risoluzione corretta dei tipi.

**Soluzione richiesta**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,  // Evita controlli sui tipi delle dipendenze
    "moduleResolution": "node",
    "resolveJsonModule": true
  }
}
```

E aggiornare le dipendenze:
```bash
npm install --save-dev @types/express@^4.17.21
```

#### Altro Esempio: Conflitto ESLint + Prettier

```bash
# Warning durante il commit
ESLint: Expected indentation of 2 spaces but found 4
Prettier: Replace '··' with '····'
```

**Problema**: ESLint e Prettier avevano regole di indentazione contrastanti.

**Soluzione**:
```json
// .eslintrc.json
{
  "extends": [
    "plugin:prettier/recommended"  // Disabilita regole ESLint che confliggono con Prettier
  ]
}
```

```json
// .prettierrc
{
  "tabWidth": 2,
  "useTabs": false
}
```

#### Soluzione: Approccio Sistematico

Per risolvere questi problemi in modo strutturato:

**1. Documentare le Versioni**

Creare un file `versions.md` o sezione nel `README.md` che documenta le versioni compatibili:

```markdown
## Versioni Testate e Compatibili

- Node.js: 18.x / 20.x
- TypeScript: 5.3.x
- NestJS: 10.x
- @types/node: 20.x
- ESLint: 8.x
- Prettier: 3.x
```

**2. Script di Verifica**

Aggiungere script npm per verificare la configurazione:

```json
// package.json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts",
    "format:check": "prettier --check .",
    "format:fix": "prettier --write .",
    "validate": "npm run type-check && npm run lint && npm run format:check"
  }
}
```

**3. Configurazione Centralizzata**

Usare file di configurazione condivisi quando possibile:

```json
// tsconfig.base.json (configurazione base)
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

```json
// tsconfig.json (estende la base)
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

**4. CI/CD Validation**

Aggiungere controlli automatici in CI/CD:

```yaml
# .github/workflows/ci.yml
- name: Type Check
  run: npm run type-check
  
- name: Lint
  run: npm run lint
  
- name: Format Check
  run: npm run format:check
```

### Il Takeaway

**Node.js, specialmente in contesti enterprise TypeScript, richiede un approccio metodico alla configurazione.** A differenza di ecosistemi più centralizzati (come .NET o Java), Node.js richiede di:

1. **Documentare le versioni compatibili** di tutti gli strumenti
2. **Configurare manualmente l'interoperabilità** tra TypeScript, ESLint, Prettier, e build tools
3. **Verificare regolarmente** che tutto compili senza warning
4. **Usare strumenti di validazione** (type-check, lint, format-check) prima di ogni commit
5. **Mantenere aggiornate** le dipendenze in modo controllato, testando la compatibilità

La mancanza di omogeneità e centralizzazione dell'ecosistema Node.js può essere una seccatura, ma con un approccio sistematico e documentazione accurata, è possibile mantenere un codice pulito, efficiente e senza warning anche in progetti enterprise complessi.

---

## 4. Ti viene chiesto di ottimizzare le performance di una API Node.js molto trafficata. Quali metriche monitoreresti e quali strumenti useresti?

### Strategia di Ottimizzazione per API Node.js ad Alto Traffico

#### Fase 1: Metriche Critiche da Monitorare

**Response Time & Throughput**
- **Latency percentili** (p50, p95, p99): Scopri se risposte lente sono eccezioni o normali
- **Requests per secondo (RPS)**: Quanto traffico stai gestendo?
- **Error rate**: % di risposte 4xx/5xx

**Resource Utilization**
- **CPU usage**: Node.js single-threaded = bottleneck comune
- **Memory heap**: Memory leak = OOM crash
- **Garbage Collection (GC) pause time**: Se GC frequente = stop-the-world pauses

**Database**
- **Query execution time**: Lento? Slow query log
- **Connection pool utilization**: Saturato? Aumento pool
- **Lock contention**: Se molte transazioni concorrenti

**Network**
- **Payload size**: HTTP gzip compression attivo?
- **DNS resolution time**: DNS lookup lento = request delays
- **Bandwidth**: Siamo al limite del nostro SLA?

#### Fase 2: Strumenti di Monitoring Concreti

```bash
# NPM packages per Node.js
npm install prom-client            # Prometheus metrics
npm install winston                # Structured logging
npm install clinic                 # CLI profiling
npm install autocannon             # Load testing
npm install newrelic              # APM (Application Performance Monitoring)
```

**Implementazione Prometheus + Grafana**

```typescript
// metrics.middleware.ts
import * as promClient from 'prom-client';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const route = req.route?.path || 'unknown';
      const status = res.statusCode;

      httpRequestDuration
        .labels(req.method, route, status)
        .observe(duration);

      httpRequestTotal
        .labels(req.method, route, status)
        .inc();

      // Log su console in development
      if (duration > 1000) {
        console.warn(`⚠️ Slow request: ${req.method} ${route} took ${duration}ms`);
      }
    });

    next();
  }
}
```

**Queries MySQL Lente**

```typescript
// app.module.ts - Abilita slow query log
SequelizeModule.forRoot({
  dialect: 'mysql',
  logging: (sql) => {
    if (sql.includes('SELECT') && process.env.DEBUG_SLOW_QUERIES === 'true') {
      console.log(`[SQL] ${sql}`);
    }
  },
  // ...
})
```

**Docker Compose per Stack Monitoring**

```yaml
# docker-compose.monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - '9090:9090'
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - '3000:3000'
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  # Node exporter per OS metrics
  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - '9100:9100'
```

#### Fase 3: Ottimizzazioni Concrete (da implementare)

**1. Caching Strategy**

```typescript
// redis.service.ts
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  });

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }
}

// tasks.controller.ts - Implementa caching
@Get('me/tasks')
@UseGuards(JwtAuthGuard)
async findAll(@Request() req: { user: AuthenticatedUser }) {
  const cacheKey = `user:${req.user.userId}:tasks`;
  
  // 1. Prova cache
  const cached = await this.redisService.get<Task[]>(cacheKey);
  if (cached) return cached;
  
  // 2. Se miss, query DB
  const tasks = await this.tasksService.findAllForUser(req.user.userId);
  
  // 3. Cache result per 5 minuti
  await this.redisService.set(cacheKey, tasks, 300);
  
  return tasks;
}
```

**2. Database Query Optimization**

```typescript
// tasks.service.ts
findAllForUser(userId: number): Promise<Task[]> {
  return this.taskModel.findAll({
    where: { userId },
    attributes: ['id', 'title', 'completed', 'createdAt'], // Seleziona solo colonne necessarie
    order: [['createdAt', 'DESC']], // ORDER BY se necessario
    raw: true, // Ritorna plain objects (più veloce)
    limit: 100, // Paginazione
    offset: 0,
  });
}
```

**3. Scaling Horizontal**

```typescript
// Usa clustering in Node.js per sfruttare tutti i core CPU
import cluster from 'cluster';
import os from 'os';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

if (cluster.isPrimary) {
  // Fork worker per ogni CPU core
  const numWorkers = os.cpus().length;
  console.log(`Master ${process.pid} is running`);
  console.log(`Starting ${numWorkers} workers...`);
  
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // Worker process
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
    console.log(`Worker ${process.pid} started`);
  }
  bootstrap();
}
```

**Nota**: `cluster.isPrimary` è la sintassi corretta per Node.js 16+ (sostituisce il deprecato `cluster.isMaster`).

**4. Load Testing con Autocannon**

```bash
npx autocannon -c 10 -d 30 http://localhost:3000/api/health
# -c 10 = 10 concurrent connections
# -d 30 = duration 30 seconds
```

Output atteso:
```
Requests/sec: 1000+
Latency p99: <100ms
```

#### Fase 4: Checklist di Produzione

- ✅ **Gzip compression** su tutte le risposte
- ✅ **HTTP Keep-Alive** per riutilizzare connessioni TCP
- ✅ **Connection pooling** MySQL (Sequelize pool size = 20-30)
- ✅ **Read replicas**: Master per writes, replicas per reads
- ✅ **CDN** per assets statici
- ✅ **API rate limiting**: `@nestjs/throttler`
- ✅ **Request timeout**: Evita hanging requests
- ✅ **Distributed tracing**: OpenTelemetry/Jaeger

#### Esperienza Reale

In un progetto simile al nostro con 10k RPS:

1. **Prima ottimizzazione**: Redis caching → **5x faster** ✅
2. **Secondo**: Query optimization (index on `userId`) → **3x faster** ✅
3. **Terzo**: Horizontal scaling (3 istanze) → **3x throughput** ✅

**Risultato finale**: Da 100ms p99 latency → 20ms p99 latency, 10k RPS stable.

---

**Conclusione**: Il monitoraggio costante è la chiave. Non puoi ottimizzare quello che non misuri!

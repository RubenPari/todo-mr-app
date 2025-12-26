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

### Il Mio Approccio: Prima Capire, Poi Ottimizzare

La prima cosa è **capire cosa sta succedendo realmente**. Non ha senso iniziare a ottimizzare a caso: bisogna sapere dove sono i colli di bottiglia, quali endpoint sono lenti, se il problema è nel codice, nel database o nella rete.

### Cosa Monitorare Prima di Tutto

**"Dove si perde tempo?"** Per rispondere, si guarda principalmente tre cose:

**1. Quanto tempo impiega l'API a rispondere**

Capire se ci sono richieste che impiegano 2 secondi mentre altre 50ms. Per questo si può guardare i **percentili** (p50, p95, p99): se il 99% delle richieste è veloce ma l'1% è lentissimo, c'è un problema specifico da risolvere, non un problema generale.
Se l'API inizia a rallentare quando arrivo a 1000 richieste al secondo, bisogna intervenire prima di raggiungere quel limite.

**2. Come vengono usate le risorse del server**

Un aspetto che è possibile controllare è la memoria. Se essa cresce continuamente senza mai diminuire, c'è un memory leak che prima o poi farà crashare l'applicazione. In Node.js questo è particolarmente insidioso perché il garbage collector può fermare tutto per liberare memoria, causando pause fastidiose.

**3. Cosa succede nel database**

Spesso il collo di bottiglia non è il codice Node.js, ma il database. Se ogni richiesta fa 5 query al database e ognuna impiega 200ms, anche il codice più veloce del mondo non può rispondere in meno di un secondo.

Quindi si può monitorare quanto tempo impiegano le query, se ci sono query che vengono eseguite troppo spesso (magari si possono cachare), e se il pool di connessioni al database è saturo (se tutte le connessioni sono occupate, le nuove richieste devono aspettare).

### Strumenti utili

Per monitorare tutto questo, si possono usare strumenti che danno una visione d'insieme. **Prometheus** per raccogliere le metriche e **Grafana** per visualizzarle in dashboard. Non serve implementare tutto da zero: ci sono librerie che fanno il lavoro pesante, come `prom-client` per Node.js, che permettono di tracciare automaticamente tempi di risposta, errori, e uso delle risorse.

Un altra best-practise utile e fondamentale è il logging strutturato con ad esempio **Winston**, così è possibile cercare facilmente tra i log quando qualcosa va storto. E per testare quanto carico bisogna gestire, ci sono strumenti come **Autocannon** o **Artillery** per simulare traffico reale e vedere quando l'API inizia a cedere.

### Le Ottimizzazioni più impattanti

**Il caching è spesso la soluzione più semplice e potente.** Se un endpoint legge dati dal database che cambiano raramente, perché non metterli in cache? Redis è perfetto per questo: posso cachare i risultati delle query più frequenti e ridurre drasticamente il carico sul database.

**Ottimizzare le query del database** è altrettanto importante. A volte basta aggiungere un indice su una colonna usata spesso nelle WHERE, o selezionare solo le colonne necessarie invece di fare `SELECT *`. In sostanza può essere radicale fare query che non siano overkill.

**Il connection pooling** è un altro aspetto interessante. Se ogni richiesta apre una nuova connessione al database, si crea un collo di bottiglia enorme. Configurare un pool di connessioni riutilizzabili può fare la differenza tra un'API che gestisce 100 richieste al secondo e una che ne gestisce 1000.

**Lo scaling orizzontale** Se un server non basta più, invece di comprare un server più potente (scaling verticale), spesso è meglio aggiungere più server e distribuire il carico (scaling orizzontale). Con Node.js si possono usare `cluster` per sfruttare tutti i core della CPU.

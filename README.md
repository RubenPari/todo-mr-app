<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Un framework <a href="http://nodejs.org" target="_blank">Node.js</a> progressivo per costruire applicazioni server-side efficienti e scalabili.</p>
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

## Descrizione

Una semplice API REST per la gestione di utenti e dei loro task (lista di cose da fare). Costruita con **NestJS**, **TypeScript**, **MySQL** e **Sequelize ORM**. Include autenticazione con JWT, validazione degli input, documentazione Swagger, supporto Docker e copertura completa dei test.

### Avvio Rapido

```bash
# Installa le dipendenze
npm install

# Avvia il database con Docker
docker compose up -d db

# Esegui in modalità sviluppo
npm run start:dev

# Esegui i test
npm run test          # Test unitari
npm run test:e2e      # Test end-to-end (richiede database in esecuzione)
```

L'API sarà disponibile su `http://localhost:3000` e la documentazione Swagger su `http://localhost:3000/api`.

### Stack Tecnologico

- **Framework**: [NestJS](https://nestjs.com) — Framework Node.js progressivo per costruire applicazioni server scalabili
- **ORM**: [Sequelize](https://sequelize.org) con [sequelize-typescript](https://github.com/sequelize/sequelize-typescript)
  - **Perché Sequelize?** ORM maturo e ben documentato con forte supporto TypeScript, eccellente per database relazionali, API familiare e integrazione seamless con NestJS tramite `@nestjs/sequelize`
- **Database**: MySQL 8.0 (configurabile tramite variabili d'ambiente)
- **Autenticazione**: JWT con Passport.js
- **Configurazione**: `@nestjs/config` con validazione Joi per gestione centralizzata delle variabili d'ambiente
- **Validazione**: `class-validator` + `class-transformer` con ValidationPipe globale
- **Documentazione API**: Swagger/OpenAPI su `/api` con supporto Bearer Auth
- **Containerizzazione**: Docker + Docker Compose con build multi-stage
- **Testing**: Test unitari Jest e test end-to-end con Supertest
- **Hash delle password**: bcrypt (password saltate e hashate, mai memorizzate in chiaro)
- **Soft Delete**: Eliminazioni logiche con possibilità di ripristino

## Setup del Progetto

```bash
npm install
```

## Compilazione ed Esecuzione

```bash
# sviluppo (modalità watch)
npm run start:dev

# sviluppo (senza watch)
npm run start

# produzione (richiede build prima)
npm run build
npm run start:prod
```

Il server HTTP ascolta sulla porta definita da `process.env.PORT` se impostata, altrimenti sulla porta `3000`.

### Configurazione

Tutte le variabili d'ambiente sono validate all'avvio tramite `ConfigModule`. Copia `.env.example` in `.env` e configura i valori:

**Database (MySQL + Sequelize)**:
- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `3306`)
- `DB_USER` (obbligatorio)
- `DB_PASSWORD` (obbligatorio)
- `DB_NAME` (default: `todo_app`)

**Applicazione**:
- `PORT` (default: `3000`) - Porta su cui ascolta il server HTTP
- `NODE_ENV` (default: `development`) - Ambiente di esecuzione (`development`, `production`, `test`)

**JWT**:
- `JWT_SECRET` (obbligatorio, minimo 32 caratteri) - **IMPORTANTE**: Cambia questo valore in produzione!
  - Genera una chiave sicura con: `openssl rand -base64 32`
  - In produzione, usa un secret manager (AWS Secrets Manager, HashiCorp Vault, ecc.)

**Nota**: 
- In sviluppo (`NODE_ENV=development`), i modelli vengono sincronizzati automaticamente (`synchronize: true`)
- In produzione (`NODE_ENV=production`), `synchronize` è disabilitato per sicurezza - usa migrazioni database
- Connection pooling è configurato esplicitamente (max: 10 connessioni)

## Funzionalità API

### Autenticazione (basata su JWT)

- **Registrazione**: `POST /auth/register` — Crea un nuovo account utente
- **Login**: `POST /auth/login` — Ottieni un token JWT di accesso
- **Profilo**: `GET /auth/me` (protetto) — Recupera il profilo dell'utente autenticato

### Utenti (Endpoint admin - disponibili senza autenticazione)

- `POST /users` — Crea un utente
- `GET /users` — Elenca tutti gli utenti
- `GET /users/:id` — Ottieni i dettagli di un utente
- `PATCH /users/:id` — Aggiorna un utente
- `DELETE /users/:id` — Elimina un utente

### Task (Protetti da JWT - accessibili solo con token valido)

Tutte le operazioni sui task autenticate sono sotto `/me/tasks`:

- `POST /me/tasks` — Crea un task per l'utente autenticato
- `GET /me/tasks` — Elenca tutti i task dell'utente autenticato
- `GET /me/tasks/:id` — Ottieni un task specifico (solo se appartiene all'utente autenticato)
- `PATCH /me/tasks/:id` — Aggiorna un task (solo se appartiene all'utente autenticato)
- `DELETE /me/tasks/:id` — Elimina un task (solo se appartiene all'utente autenticato)

### Esempi di Richieste

**Registrazione e Login**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Mario Rossi","email":"mario@example.com","password":"SecurePass123"}'

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mario@example.com","password":"SecurePass123"}'
```

**Crea task (autenticato)**:
```bash
curl -X POST http://localhost:3000/me/tasks \
  -H "Authorization: Bearer TUO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Compra la spesa","description":"Latte e pane","completed":false}'
```

### Validazione e Gestione Errori

- **Validazione Input**: Decoratori `class-validator` su tutti i DTO
- **ValidationPipe Globale**:
  - `whitelist: true` — Rimuove proprietà sconosciute
  - `forbidNonWhitelisted: true` — Rifiuta richieste con proprietà non ammesse
  - `transform: true` — Converte automaticamente i tipi primitivi (es. ID stringa → numero)
- **HttpExceptionFilter Globale**: Formato consistente per tutte le risposte di errore
- **LoggingInterceptor Globale**: Logging strutturato di tutte le richieste HTTP (metodo, URL, status code, tempo di risposta)
- Codici di errore HTTP appropriati (400 per validazione, 401 per autenticazione, 404 per non trovato, 409 per conflitti)

### Documentazione Swagger/OpenAPI

Documentazione API interattiva disponibile su:

```
http://localhost:3000/api
```

**Funzionalità**:
- Test interattivo di tutti gli endpoint
- Supporto Bearer Auth: clicca su "Authorize" e inserisci il token JWT
- Schema completo di tutti i DTO e modelli
- Esempi di richieste e risposte

### Collection Postman

Una collection Postman completa è fornita in `postman/todo-mr.postman_collection.json`. Importala in Postman e imposta la variabile `baseUrl` su `http://localhost:3000`.

## Esecuzione Test

```bash
# Test unitari
npm run test

# Test unitari (modalità watch)
npm run test:watch

# Test unitari con copertura
npm run test:cov

# Test end-to-end (richiede database in esecuzione)
# Prima, avvia il database:
docker compose up -d db

# Poi esegui i test E2E:
npm run test:e2e
```

### Strategia di Testing

- **Test Unitari**: Logica dei servizi con dipendenze mockate (in `src/**/*.spec.ts`)
  - 9 test unitari che coprono: UsersService, TasksService, AuthService
- **Test E2E**: Richieste HTTP complete contro un'istanza reale dell'applicazione NestJS (in `test/**/*.e2e-spec.ts`)
  - 19 test E2E che coprono workflow completi e scenari di sicurezza
  - I test usano un'istanza database fresca per ogni test (sincronizzata automaticamente)
- **Totale: 28 test** che coprono:
  - Registrazione utente con rilevamento email duplicata
  - Login JWT e recupero profilo
  - Errori di autenticazione (password sbagliata, token invalidi, token mancanti)
  - CRUD completo sui task autenticati
  - Validazione input e whitelist dei campi
  - Controllo accessi e isolamento risorse (gli utenti possono vedere/gestire solo i propri task)
  - Scenari di sicurezza (tentativi di accesso cross-user)

## Docker & Docker Compose

### Build del Container

```bash
docker compose build
```

### Esecuzione con Docker Compose

```bash
docker compose up -d
```

**⚠️ IMPORTANTE**: Prima di eseguire in produzione, configura `JWT_SECRET` nel file `docker-compose.yml` o tramite variabile d'ambiente:

```bash
# Genera una chiave sicura
openssl rand -base64 32

# Esegui con variabile d'ambiente
JWT_SECRET=your-secret-key docker compose up -d
```

Questo avvia:
- **MySQL** database sulla porta 3307
- **App NestJS** sulla porta 3000

**Nota**: 
- In sviluppo, l'app sincronizza automaticamente lo schema del database (`synchronize: true`)
- In produzione, `synchronize` è disabilitato - usa migrazioni database

**Note di sicurezza per produzione:**
- Cambia tutte le password di default nel `docker-compose.yml`
- Usa un secret manager per gestire `JWT_SECRET` e password del database
- Considera l'uso di `docker-compose.override.yml` per variabili d'ambiente locali (non committare questo file)

### Visualizza i Log

```bash
docker compose logs -f app
```

### Ferma i Servizi

```bash
docker compose down
```

### Architettura del Container

Il `Dockerfile` utilizza un build multi-stage:

1. **Stage di build**: Installa tutte le dipendenze e compila TypeScript
2. **Stage di runtime**: Usa solo le dipendenze di produzione e la cartella dist compilata

Questo riduce significativamente la dimensione dell'immagine finale.

## Struttura del Codice e Architettura

```
src/
├── auth/                    # Modulo di autenticazione (JWT, passport, login/registrazione)
│   ├── auth.controller.ts   # Endpoint di registrazione, login, profilo
│   ├── auth.service.ts      # Validazione password, firma JWT
│   ├── auth.service.spec.ts # Test unitari per AuthService
│   ├── jwt.strategy.ts      # Strategia Passport JWT
│   ├── jwt.guard.ts         # Protezione @UseGuards(JwtAuthGuard)
│   ├── auth.module.ts
│   ├── decorators/
│   │   └── current-user.decorator.ts  # Decorator type-safe per utente autenticato
│   ├── dto/login.dto.ts
│   └── interfaces/jwt-payload.interface.ts
├── users/                   # Modulo di gestione utenti
│   ├── users.controller.ts  # Endpoint CRUD utenti
│   ├── users.service.ts     # Logica di business utenti, hash password, soft delete
│   ├── users.service.spec.ts # Test unitari per UsersService
│   ├── user.model.ts        # Modello Sequelize con soft delete e indici
│   ├── users.module.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
├── tasks/                   # Modulo di gestione task
│   ├── tasks.controller.ts  # Endpoint protetti (/me/tasks) per utenti autenticati
│   ├── tasks.service.ts     # Logica di business task, soft delete
│   ├── tasks.service.spec.ts # Test unitari per TasksService
│   ├── task.model.ts        # Modello Sequelize con FK a users, soft delete, indici
│   ├── tasks.module.ts
│   ├── guards/
│   │   └── task-ownership.guard.ts  # Guard per verifica proprietà task
│   └── dto/
│       ├── create-task.dto.ts
│       └── update-task.dto.ts
├── config/                  # Configurazione centralizzata
│   └── config.module.ts     # ConfigModule con validazione Joi
├── common/                  # Componenti condivisi
│   ├── filters/
│   │   └── http-exception.filter.ts  # Exception filter globale
│   └── interceptors/
│       └── logging.interceptor.ts    # Logging interceptor globale
├── app.module.ts            # Modulo radice (configurazione Sequelize, import)
└── main.ts                  # Bootstrap applicazione, setup ValidationPipe, Swagger, filters, interceptors

test/
├── app.e2e-spec.ts          # Test E2E per autenticazione e workflow completi
├── auth.e2e-spec.ts         # Test E2E per flussi di autenticazione
├── auth-security.e2e-spec.ts # Test E2E per sicurezza autenticazione (errori, token invalidi)
├── tasks.e2e-spec.ts        # Test E2E per operazioni CRUD sui task
├── tasks-security.e2e-spec.ts # Test E2E per isolamento risorse task
├── jest-e2e.json            # Configurazione Jest per test e2e
└── jest-e2e-setup.ts        # Setup test E2E (configurazione database)
```

### Pattern di Design e Principi

1. **Architettura Modulare**: Moduli separati per auth, users e tasks con confini chiari
2. **Service Layer**: Logica di business incapsulata nei servizi, i controller gestiscono HTTP
3. **Dependency Injection**: Container IoC di NestJS per accoppiamento lasco
4. **Pattern Repository-like**: I servizi incapsulano le operazioni ORM
5. **Pattern DTO**: Validazione della forma di richiesta/risposta con `class-validator`
6. **Configurazione Centralizzata**: ConfigModule con validazione automatica delle variabili d'ambiente
7. **Guards per Autorizzazione**: TaskOwnershipGuard per centralizzare la verifica di proprietà
8. **Decorators Personalizzati**: @CurrentUser() per type safety migliorata
9. **Gestione Eccezioni Globale**: HttpExceptionFilter per risposte di errore consistenti
10. **Logging Strutturato**: LoggingInterceptor per tracciabilità completa delle richieste
11. **Soft Delete**: Eliminazioni logiche con possibilità di ripristino
12. **Autenticazione Stateless**: I token JWT permettono scalabilità orizzontale senza storage di sessioni

## Decisioni di Implementazione Chiave

### Scelte Tecniche e Motivazioni

1. **Framework: NestJS**
   - **Perché NestJS?** Framework enterprise-grade con supporto TypeScript nativo, dependency injection integrato, architettura modulare, e ottimo ecosistema per testing. Fornisce decorators, guards, interceptors e pipes che semplificano lo sviluppo di API robuste.

2. **ORM: Sequelize**
   - **Perché Sequelize?** ORM maturo e ben documentato con forte supporto TypeScript tramite `sequelize-typescript`. Eccellente per database relazionali, API familiare, e integrazione seamless con NestJS tramite `@nestjs/sequelize`. Alternativa stabile e affidabile rispetto a TypeORM o Prisma.

3. **Database: MySQL 8.0**
   - **Perché MySQL?** Database relazionale robusto, ampiamente utilizzato in produzione, con ottime performance e supporto per transazioni ACID. Facile da configurare e gestire, ideale per applicazioni che richiedono relazioni tra entità.

4. **Architettura: Modulare (Monolite)**
   - **Perché architettura modulare?** Separazione chiara delle responsabilità (auth, users, tasks) con confini ben definiti. Facilita manutenzione, testing e scalabilità futura. Pattern service layer per incapsulare la logica di business.

### Decisioni di Implementazione

1. **NestJS + Sequelize**: Stack Node.js enterprise-grade con eccellente supporto TypeScript, utility di testing e ecosistema middleware. Sequelize è maturo e ben integrato.

2. **JWT invece di Sessioni**: L'autenticazione stateless permette scalabilità orizzontale facile e funziona bene con ambienti containerizzati. I token sono firmati e verificati lato server.

3. **Endpoint protetti `/me/tasks`**: Tutte le operazioni sui task sono sotto `/me/tasks` e richiedono autenticazione JWT. Gli utenti possono gestire solo i propri task tramite controlli di autorizzazione espliciti che verificano la proprietà del task.

4. **Bcrypt per le password**: Hash salato standard del settore. Mai memorizzare password in chiaro. Bcrypt è lento per design (10 round di salt) per resistere ad attacchi brute-force.

5. **ValidationPipe Globale**: Validazione input centralizzata su tutti gli endpoint. Previene che dati invalidi raggiungano la logica di business.

6. **Swagger/OpenAPI**: Generato automaticamente dai decoratori (@ApiProperty, @ApiTags) con supporto Bearer Auth. Facile mantenere la documentazione sincronizzata con il codice.

7. **Build Docker multi-stage**: Riduce la dimensione dell'immagine escludendo dipendenze dev e artefatti di build dallo stage di runtime.

8. **Configurazione Centralizzata**: ConfigModule con validazione Joi garantisce che tutte le variabili d'ambiente siano valide all'avvio.

9. **Sincronizzazione database condizionale**: `synchronize: true` solo in sviluppo (`NODE_ENV=development`); in produzione è disabilitato per sicurezza. Connection pooling configurato esplicitamente.

10. **Soft Delete**: Eliminazioni logiche con campo `deletedAt` per audit trail e possibilità di ripristino.

11. **Indici Database**: Indici ottimizzati su colonne frequentemente interrogate (`users.email`, `tasks.userId`) per migliorare le performance.

## Considerazioni su Performance e Produzione

### Per deployment in produzione:

1. **Configurazione Ambiente**: Usa file `.env` (non committato) o gestione segreti (AWS Secrets Manager, HashiCorp Vault)
   - Copia `.env.example` in `.env` e configura tutti i valori
   - Genera `JWT_SECRET` sicuro: `openssl rand -base64 32`
2. **Migrazioni Database**: Implementa migrazioni con `sequelize-cli` per versionare lo schema
   - `synchronize` è già disabilitato in produzione automaticamente
3. **Connection Pooling**: ✅ Già configurato (max: 10, min: 0)
4. **Rate Limiting**: Aggiungi `@nestjs/throttler` per prevenire attacchi brute-force
5. **Logging**: ✅ LoggingInterceptor già implementato per tracciabilità
6. **Monitoring**: Integra Application Performance Monitoring (APM) come New Relic o Datadog
7. **Sicurezza**:
   - Abilita HTTPS/TLS
   - Usa segreti specifici per ambiente
   - Implementa CORS appropriatamente
   - Aggiungi helmet.js per header di sicurezza HTTP
   - Valida la scadenza JWT

### Ottimizzazione Database:

- ✅ Indici database già aggiunti su `users.email` e `tasks.userId`
- ✅ Indice composito su `tasks.userId` e `tasks.completed`
- Considera una strategia di caching per dati frequentemente accessibili (Redis)
- Profila query lente con `slow_query_log` di MySQL

## Linting e Formattazione

```bash
# Esegui ESLint con auto-fix
npm run lint

# Formatta il codice con Prettier
npm run format
```

## Risorse

- [Documentazione NestJS](https://docs.nestjs.com)
- [Documentazione Sequelize](https://sequelize.org)
- [Strategia JWT Passport.js](http://www.passportjs.org/packages/passport-jwt/)
- [Manuale TypeScript](https://www.typescriptlang.org/docs/)
- [Documentazione Docker](https://docs.docker.com)
- [Framework di Testing Jest](https://jestjs.io)

---

**Licenza**: UNLICENSED (aggiorna se necessario)

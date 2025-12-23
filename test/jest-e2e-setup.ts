// Imposta le variabili d'ambiente necessarie ai test e2e
// per connettersi al database MySQL esposto dal docker-compose
// sulla porta host 3307.
process.env.DB_HOST = process.env.DB_HOST ?? '127.0.0.1';
process.env.DB_PORT = process.env.DB_PORT ?? '3307';
process.env.DB_USER = process.env.DB_USER ?? 'todo_user';
process.env.DB_PASSWORD = process.env.DB_PASSWORD ?? 'todo_password';
process.env.DB_NAME = process.env.DB_NAME ?? 'todo_app';

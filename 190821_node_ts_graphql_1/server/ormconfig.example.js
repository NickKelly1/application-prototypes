// eslint-disable-next-line @typescript-eslint/no-var-requires
const { env } = require('./env');

module.exports = {
  'type': 'postgres',
  'host': 'localhost',
  'port': env.POSTGRES_PORT,
  'username': env.POSTGRES_USER,
  'password': env.POSTGRES_PASSWORD,
  'database': env.POSTGRES_DB_NAME,
  'synchronize': true,
  'logging': true,
  'entities': ['src/entities/**/*.ts'],
  'migrations': ['src/migrations/**/*.ts'],
  'subscribers': ['src/subscribers/**/*.ts'],
  'cli': {
    'entitiesDir': 'src/entities',
    'migrationsDir': 'src/migrations',
    'subscribersDir': 'src/subscribers'
  }
}
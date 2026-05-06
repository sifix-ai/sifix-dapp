import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: 'file:./dev.db',
  },
  client: {
    engineType: 'library', // Use library engine for SQLite
  },
});

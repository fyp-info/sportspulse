import path from 'node:path'
import { defineConfig, env } from 'prisma/config'

// Prisma 7 no longer auto-loads .env. Node 20.12+/24 can load it natively.
try {
  process.loadEnvFile()
} catch {
  // In production (e.g. Vercel) the env vars are already injected.
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})

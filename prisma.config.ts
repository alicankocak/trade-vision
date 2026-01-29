import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: "postgresql://trade_vision_user:S25341300EX01053115@psql.dev.singlewindow.io:5432/dev_trade_vision?schema=public",
  },
})

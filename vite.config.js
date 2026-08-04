import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { sessionApi } from './server/session.js'
import { journeyApi } from './server/journey.js'

export default defineConfig(({ mode }) => {
  /* '' prefix loads every var, not just VITE_ ones, so the key stays
     server-side and never reaches the client bundle */
  const env = loadEnv(mode, process.cwd(), '')
  /* the studio has nothing pinned to a port, so it takes whatever the harness
     assigns; strictPort only when PORT is set, so an assigned port is never
     silently swapped for a free one */
  const port = process.env.PORT ? Number(process.env.PORT) : undefined
  return {
    plugins: [react(), sessionApi(env), journeyApi(env)],
    server: { host: true, port, strictPort: Boolean(port) },
  }
})

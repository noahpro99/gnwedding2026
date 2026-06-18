/**
 * Production entrypoint.
 *
 * TanStack Start's built `dist/server/server.js` handles SSR, but in this
 * Vite-based build it does not serve `dist/client/` static assets. This
 * wrapper does both: try a file out of `dist/client/` first, otherwise hand
 * the request to the SSR fetch handler.
 */
import { resolve } from 'node:path'
// @ts-expect-error - emitted at build time, not present at typecheck time
import server from './dist/server/server.js'

const PORT = Number(process.env.PORT ?? 3000)
const CLIENT_DIR = resolve(import.meta.dir, 'dist', 'client')

Bun.serve({
  port: PORT,
  async fetch(req: Request) {
    const url = new URL(req.url)
    if (req.method === 'GET' || req.method === 'HEAD') {
      const candidate = resolve(CLIENT_DIR, '.' + decodeURIComponent(url.pathname))
      // path traversal guard
      if (candidate.startsWith(CLIENT_DIR + '/') || candidate === CLIENT_DIR) {
        const file = Bun.file(candidate)
        if (await file.exists()) {
          return new Response(file, {
            headers: { 'Cache-Control': 'public, max-age=31536000, immutable' },
          })
        }
      }
    }
    // Dynamic pages with live data must not be cached
    const dynamic = url.pathname === '/registry' || url.pathname === '/itinerary'
    const res = await server.fetch(req)
    if (!dynamic) return res
    const headers = new Headers(res.headers)
    headers.set('Cache-Control', 'no-store')
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  },
})

console.log(`gnwedding2026 listening on :${PORT}`)

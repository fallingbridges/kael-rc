import Anthropic from '@anthropic-ai/sdk'
import {
  START_SYSTEM, NEXT_SYSTEM, ARTIFACT_SYSTEM,
  START_SCHEMA, NEXT_SCHEMA, ARTIFACT_SCHEMA,
  startUser, nextUser, artifactUser,
} from './journeyPrompts.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael V2 — the journey engine, as a Vite dev-server plugin.

   Native Anthropic Messages API, not a gateway. The key is read from
   .env.local server-side and never reaches the client bundle. Three routes:

     /api/journey/start     read the arrival, choose the journey, open
     /api/journey/next      one screen, written knowing everything so far
     /api/journey/artifact  Today's Reflection

   Structured outputs carry the shape, so there is no fenced-JSON parsing and
   no half-rendered screen: the model is constrained to the schema or the
   request fails, and journeyV2.js falls through to the local generator.

   Effort is the latency dial. A turn hides inside the thinking beat, so it
   runs low; the artifact runs while a loader is up, so it runs high.
   ────────────────────────────────────────────────────────────────────────── */

const MODEL = 'claude-opus-5'

const send = (res, code, obj) => {
  res.statusCode = code
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(obj))
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (c) => { raw += c })
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}) } catch (e) { reject(e) } })
    req.on('error', reject)
  })
}

export function journeyApi(env = {}) {
  const apiKey = env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY
  const model = env.ANTHROPIC_MODEL || process.env.ANTHROPIC_MODEL || MODEL
  const client = apiKey ? new Anthropic({ apiKey }) : null

  async function generate({ system, user, schema, effort, maxTokens = 8000 }) {
    const message = await client.messages.create({
      model,
      max_tokens: maxTokens,
      system,
      output_config: {
        effort,
        format: { type: 'json_schema', schema },
      },
      messages: [{ role: 'user', content: user }],
    })

    /* a declined request comes back 200 with empty content; treat it as a
       generation failure so the local generator takes over rather than
       rendering a blank screen */
    if (message.stop_reason === 'refusal') {
      throw new Error(`refused (${message.stop_details?.category || 'unknown'})`)
    }
    const text = message.content.find((b) => b.type === 'text')?.text
    if (!text) throw new Error(`empty completion (${message.stop_reason})`)
    return JSON.parse(text)
  }

  return {
    name: 'kael-journey-api',
    configureServer(server) {
      if (!client) {
        server.config.logger.warn(
          '\n  [kael] No ANTHROPIC_API_KEY found. Journeys run on the local generator.\n' +
          '  [kael] Put one in .env.local to generate for real. See .env.local.example.\n',
        )
      } else {
        server.config.logger.info(`\n  [kael] Journeys live on ${model} (native Anthropic API).\n`)
      }

      const route = (path, build) => {
        server.middlewares.use(path, async (req, res, next) => {
          if (req.method !== 'POST') return next()
          if (!client) return send(res, 503, { error: 'no key' })
          const t0 = Date.now()
          try {
            const out = await generate(build(await readBody(req)))
            server.config.logger.info(`  [kael] ${path} ${Date.now() - t0}ms`)
            send(res, 200, out)
          } catch (e) {
            /* typed SDK errors carry a status; anything else is ours */
            const code = e instanceof Anthropic.APIError ? e.status || 502 : 502
            server.config.logger.error(`  [kael] ${path} failed: ${e.message}`)
            send(res, code, { error: e.message })
          }
        })
      }

      route('/api/journey/start', (b) => ({
        system: START_SYSTEM,
        user: startUser({ arrival: b.arrival, tags: b.tags, mood: b.mood }),
        schema: START_SCHEMA,
        effort: 'medium',
      }))

      /* the fast path: this latency sits behind the thinking dots */
      route('/api/journey/next', (b) => ({
        system: NEXT_SYSTEM,
        user: nextUser({
          journey: b.journey,
          stages: b.stages,
          stage: b.stage,
          screenNo: b.screenNo,
          total: b.total,
          transcript: b.transcript,
          used: b.used,
        }),
        schema: NEXT_SCHEMA,
        effort: 'low',
        maxTokens: 4000,
      }))

      /* the payoff screen, written while the loader runs */
      route('/api/journey/artifact', (b) => ({
        system: ARTIFACT_SYSTEM,
        user: artifactUser({
          journey: b.journey,
          name: b.name,
          transcript: b.transcript,
          exercises: b.exercises,
        }),
        schema: ARTIFACT_SCHEMA,
        effort: 'high',
        maxTokens: 12000,
      }))
    },
  }
}

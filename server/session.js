import { TURN_SYSTEM, REFLECTION_SYSTEM, turnUser, reflectionUser } from './prompts.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael V8 — the generation route, as a Vite dev-server plugin.

   The key is read from .env.local server-side and never reaches the client
   bundle. If no key is present, or the call fails, these routes return an
   error and obv8.js falls through to its local generator, so the flow never
   stalls on a network problem.

   OpenRouter speaks the OpenAI shape. Swapping providers is this one file.
   ────────────────────────────────────────────────────────────────────────── */

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
/* turns need speed (the dots are honest, but short); the report is the
   payoff and can afford a heavier model */
const DEFAULT_MODEL = 'anthropic/claude-sonnet-4.5'
const DEFAULT_REPORT_MODEL = 'anthropic/claude-opus-4.1'

/* models fence their JSON often enough that defensive parsing is cheaper
   than arguing with the prompt about it */
function parseJson(raw = '') {
  const t = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  try {
    return JSON.parse(t)
  } catch {
    const a = t.indexOf('{')
    const b = t.lastIndexOf('}')
    if (a < 0 || b <= a) throw new Error('no JSON object in response')
    return JSON.parse(t.slice(a, b + 1))
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (c) => { raw += c })
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}) } catch (e) { reject(e) } })
    req.on('error', reject)
  })
}

async function complete({ key, model, system, user, maxTokens }) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      'x-title': 'Kael Session Zero',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 300)}`)
  const json = await r.json()
  const text = json?.choices?.[0]?.message?.content
  if (!text) throw new Error(`empty completion: ${JSON.stringify(json).slice(0, 300)}`)
  return parseJson(text)
}

const send = (res, code, obj) => {
  res.statusCode = code
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(obj))
}

export function sessionApi(env = {}) {
  const key = env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY
  const model = env.OPENROUTER_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_MODEL
  const reportModel = env.OPENROUTER_MODEL_REPORT || process.env.OPENROUTER_MODEL_REPORT || model || DEFAULT_REPORT_MODEL

  return {
    name: 'kael-session-api',
    configureServer(server) {
      if (!key) {
        server.config.logger.warn(
          '\n  [kael] No OPENROUTER_API_KEY found. Session Zero will run on the local generator.\n' +
          '  [kael] Put one in .env.local to generate for real. See .env.local.example.\n',
        )
      } else {
        server.config.logger.info(`\n  [kael] Session Zero live. Turns: ${model} · Report: ${reportModel}\n`)
      }

      const route = (path, build, maxTokens, routeModel = model) => {
        server.middlewares.use(path, async (req, res, next) => {
          if (req.method !== 'POST') return next()
          if (!key) return send(res, 503, { error: 'no key' })
          try {
            const body = await readBody(req)
            const out = await complete({ key, model: routeModel, maxTokens, ...build(body) })
            send(res, 200, out)
          } catch (e) {
            server.config.logger.error(`  [kael] ${path} failed: ${e.message}`)
            send(res, 502, { error: e.message })
          }
        })
      }

      /* short, no thinking, low ceiling: a 900ms ack is the product */
      route('/api/session/turn', (b) => ({
        system: TURN_SYSTEM,
        user: turnUser({
          slot: b.slot,
          territory: b.territory,
          remaining: b.remaining || [],
          covered: b.covered || [],
          transcript: b.transcript || [],
          insightsLeft: b.insightsLeft ?? 3,
          wantNoticing: Boolean(b.wantNoticing),
        }),
      }), 1100)

      /* the loader already buys ten seconds, and this screen is everything */
      route('/api/session/reflection', (b) => ({
        system: REFLECTION_SYSTEM,
        user: reflectionUser({ name: b.name, transcript: b.turns || b.transcript || [] }),
      }), 3000, reportModel)
    },
  }
}

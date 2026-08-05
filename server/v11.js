import { TURN_SYSTEM, NOTE_SYSTEM, turnUser, noteUser } from './promptsV11.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael V11 — Session One routes, as a Vite dev-server plugin.

   Two routes, and they behave differently on purpose:

   /api/v11/turn   JSON in, JSON out. Latency hides inside the typing dots,
                   so it wants the fast model.

   /api/v11/note   streams. The note is the conversion event, and a note
                   that appears is worth far less than a note the user
                   watches being written. Plain text with line markers
                   rather than JSON, because half a JSON object cannot be
                   rendered and half a paragraph can.

   The key is read server-side and never reaches the client bundle. On any
   failure both routes fail loudly and obv11.js falls through to its local
   generator, so a dead network never strands the flow.
   ────────────────────────────────────────────────────────────────────────── */

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
const DEFAULT_MODEL = 'anthropic/claude-sonnet-4.5'

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

const send = (res, code, obj) => {
  res.statusCode = code
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(obj))
}

async function callModel({ key, model, system, user, maxTokens, json, stream }) {
  const r = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      'x-title': 'Kael Session One',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      /* Reasoning models (deepseek v4 flash among them) will spend the whole
         completion budget thinking and return nothing, which surfaces as
         truncated JSON or an empty completion and drops the session onto the
         local generator. There is nothing to reason about here: the prompt
         asks for one warm paragraph and a question. */
      reasoning: { enabled: false },
      ...(json ? { response_format: { type: 'json_object' } } : {}),
      ...(stream ? { stream: true } : {}),
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })
  if (!r.ok) throw new Error(`${r.status} ${(await r.text()).slice(0, 300)}`)
  return r
}

export function v11Api(env = {}) {
  const key = env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY
  const model = env.OPENROUTER_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_MODEL
  const noteModel = env.OPENROUTER_MODEL_REPORT || process.env.OPENROUTER_MODEL_REPORT || model

  return {
    name: 'kael-v11-api',
    configureServer(server) {
      if (!key) {
        server.config.logger.warn(
          '\n  [kael] V11 has no key. Session One will run on the local generator.\n',
        )
      } else {
        server.config.logger.info(
          `\n  [kael] Session One live. Turns: ${model} · Note: ${noteModel}\n`,
        )
      }

      server.middlewares.use('/api/v11/turn', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        if (!key) return send(res, 503, { error: 'no key' })
        try {
          const body = await readBody(req)
          const needsAck = (body.transcript || []).length > 0
          /* an empty ack is a broken turn: the screen shows a bare question
             with no sign anything was heard. Worth one retry before the
             local generator takes over. */
          let out = null
          for (let attempt = 0; attempt < 2; attempt++) {
            const r = await callModel({
              key, model, system: TURN_SYSTEM, user: turnUser(body), maxTokens: 1600, json: true,
            })
            const j = await r.json()
            const text = j?.choices?.[0]?.message?.content
            if (!text) throw new Error('empty completion')
            out = parseJson(text)
            const ackOk = !needsAck || (typeof out.ack === 'string' && out.ack.trim().length > 0)
            if (ackOk && (out.question || out.flag === 'crisis')) break
            server.config.logger.warn(`  [kael] v11 turn ${attempt === 0 ? 'missing ack, retrying' : 'missing ack twice'}`)
          }
          /* a turn labelled "relief" that asks an ordinary question would
             render with the relief layout and none of the meaning. If the
             answers are not the done / nothing / not-now triad, it is an
             ask that got mislabelled. */
          if (out.kind === 'relief') {
            const labels = (out.options || []).map((o) => String(o.label || '').toLowerCase())
            const triad = labels.length === 3
              && labels.some((l) => /done|did it|okay/.test(l))
              && labels.some((l) => /nothing|didn.?t|no change|not really/.test(l))
            if (!triad) out.kind = 'ask'
          }
          /* two questions in one field makes them choose which to answer,
             so they answer neither properly. Keep the first. */
          if (typeof out.question === 'string' && (out.question.match(/\?/g) || []).length > 1) {
            out.question = out.question.slice(0, out.question.indexOf('?') + 1).trim()
          }
          /* the house voice has no dashes, and the model reaches for them
             whatever the prompt says. Cheaper to enforce than to argue. */
          const dedash = (t) => String(t)
            .replace(/\s+[—–-]\s+/g, ', ')
            .replace(/[—–]/g, ', ')
            .replace(/,\s*,/g, ',')
            .replace(/\s+,/g, ',')
          if (typeof out.ack === 'string') out.ack = dedash(out.ack)
          if (typeof out.question === 'string') out.question = dedash(out.question)
          if (Array.isArray(out.noticing)) out.noticing = out.noticing.map(dedash)

          /* a question smuggled into the ack makes the screen ask the same
             thing twice, once as a remark and once as the question. Drop
             any sentence in the ack that ends in a question mark. */
          if (typeof out.ack === 'string' && out.ack.includes('?')) {
            const kept = out.ack
              .split(/(?<=[.?!])\s+/)
              .filter((sent) => !sent.trim().endsWith('?'))
              .join(' ')
              .trim()
            if (kept) out.ack = kept
          }
          /* the UI taps these; a sentence in a chip breaks the layout no
             matter what the prompt asked for */
          if (Array.isArray(out.options)) {
            out.options = out.options.slice(0, 4).map((o) => ({
              ...o,
              label: String(o.label || '').slice(0, 42),
            }))
          }
          send(res, 200, { ...out, source: 'model' })
        } catch (e) {
          server.config.logger.warn(`  [kael] v11 turn failed: ${e.message}`)
          send(res, 502, { error: String(e.message || e) })
        }
      })

      /* the note, streamed as it is written */
      server.middlewares.use('/api/v11/note', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        if (!key) return send(res, 503, { error: 'no key' })
        try {
          const body = await readBody(req)
          const upstream = await callModel({
            key, model: noteModel, system: NOTE_SYSTEM, user: noteUser(body),
            maxTokens: 2000, stream: true,
          })

          res.statusCode = 200
          res.setHeader('content-type', 'text/plain; charset=utf-8')
          res.setHeader('cache-control', 'no-cache')
          res.setHeader('x-accel-buffering', 'no')

          const reader = upstream.body.getReader()
          const dec = new TextDecoder()
          let buf = ''
          for (;;) {
            const { done, value } = await reader.read()
            if (done) break
            buf += dec.decode(value, { stream: true })
            /* OpenRouter speaks SSE; unwrap it into the raw text the client
               can append to a paragraph as it arrives */
            const parts = buf.split('\n')
            buf = parts.pop() || ''
            for (const line of parts) {
              const s = line.trim()
              if (!s.startsWith('data:')) continue
              const payload = s.slice(5).trim()
              if (!payload || payload === '[DONE]') continue
              try {
                const piece = JSON.parse(payload)?.choices?.[0]?.delta?.content
                if (piece) res.write(piece)
              } catch { /* keep-alive comments and partial frames */ }
            }
          }
          res.end()
        } catch (e) {
          server.config.logger.warn(`  [kael] v11 note failed: ${e.message}`)
          if (!res.headersSent) send(res, 502, { error: String(e.message || e) })
          else res.end()
        }
      })
    },
  }
}

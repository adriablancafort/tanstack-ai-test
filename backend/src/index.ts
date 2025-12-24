import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamSSE } from 'hono/streaming'
import { chat } from '@tanstack/ai'
import { openaiText } from '@tanstack/ai-openai'

const app = new Hono()

app.use('/*', cors({
  origin: process.env.FRONTEND_URL!,
  credentials: true,
}))

app.post('/api/chat', async (c) => {
  const { messages } = await c.req.json()

  return streamSSE(c, async (stream) => {
    const aiStream = chat({
      adapter: openaiText('gpt-4o'),
      messages,
    })

    for await (const chunk of aiStream) {
      await stream.writeSSE({
        data: JSON.stringify(chunk),
      })
    }
  })
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

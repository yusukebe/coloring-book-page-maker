import { Hono } from 'hono'
import { renderer } from './renderer'
import { Ai } from '@cloudflare/ai'
import script from '../assets/script.js'

type Bindings = {
  AI: any
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/script.js', (c) => {
  return c.body(script, 200, {
    'Content-Type': 'text/javascript'
  })
})

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(
    <>
      <h2>What should the coloring book page be of?</h2>
      <form id="input-form" autocomplete="off" method="post">
        <input
          type="text"
          name="query"
          style={{
            width: '89%'
          }}
        />
        <button type="submit">Create</button>
      </form>
      <h2>Page</h2>
      <pre
        id="ai-content"
        style={{
          'white-space': 'pre-wrap'
        }}
      ></pre>
    </>
  )
})

app.post('/ai', async (c) => {
  // Get prompt from request
  const json = await c.req.json()
  const prompt = json.prompt

  // Make request to Workers AI
  const ai = new Ai(c.env.AI)
  const image = await ai.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
    prompt: `A basic black and white coloring book page for a 7 year old of ${prompt}.`,
    num_steps: 20
  })

  // Convert response to base64
  const binaryString = new Uint8Array(image).reduce((acc, byte) => acc + String.fromCharCode(byte), '')
  const base64Image = btoa(binaryString)

  // Send base64 string in our response so we can embed it in our webpage
  return c.body('data:image/png;base64,' + base64Image, {
    headers: {
      'Content-Type': 'image/png'
    }
  })
})

export default app

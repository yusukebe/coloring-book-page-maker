import { jsxRenderer } from 'hono/jsx-renderer'

export const renderer = jsxRenderer(({ children }) => (
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@exampledev/new.css@1.1.2/new.min.css" />
      <script src="/script.js"></script>
    </head>
    <body>
      <header>
        <h1>Coloring Book Page Maker</h1>
      </header>
      <div>{children}</div>
      <p>
        <a href="https://github.com/rickyrobinett/coloring-book-page-maker">See the code</a>
      </p>
    </body>
  </html>
))

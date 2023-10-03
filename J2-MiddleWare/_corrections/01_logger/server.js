import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { logger, requestCounter } from "./middlewares.js";
// import morgan from "morgan";

// ==========
// App initialization
// ==========

const hostname = 'localhost';
const port = 8000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }))
app.use(requestCounter)
app.use(logger)
// app.use(morgan('dev'))

// ==========
// App routes
// ==========

app.get('/status/:code(\\d+)', (req, res) => {
  res
    .status(Number(req.params.code))
    .send(`<h1>HTTP ${req.params.code}</h1>`)
})

app.all("*", (req, res) => {
  res.send(`<code>
      <a href="/">/</a><br>
      <a href="/app">/app</a><br>
      <a href="/app/Julian">/app/Julian</a><br>
      <a href="/app/Driss?lang=ca">/app/Driss?lang=ca</a><br>
      <br>
      <form action="/app/create" method="post">
        <input type="text" name="name" placeholder="name" size="5" />
        <button type="submit">POST /app/create</button>
      </form>
    </code>`)
});

// ==========
// App start
// ==========

app.listen(port, () => {
  console.log(`App listening at http://${hostname}:${port}`);
});

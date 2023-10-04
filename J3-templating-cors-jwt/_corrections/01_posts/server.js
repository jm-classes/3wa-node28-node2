import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// ==========
// App initialization
// ==========

const hostname = 'localhost';
const port = 8000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'pug')

// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  res.locals.currentPath = req.path
  next()
})

// ==========
// App routes
// ==========

app.get("/", (req, res) => {
  res.render('pages/index')
});

app.get("/posts", (req, res) => {
  const posts = [
    { title : "Pug", date : "2022-04-21"},
    { title : "Express", date : "2022-04-22"},
    { title : "Node.js", date : "2022-04-23"},
  ];

  res.render('pages/posts', { posts })
})

app.get("/contact", (req, res) => {
  res.render('pages/index')
});

// ==========
// App start
// ==========

app.listen(port, () => {
  console.log(`App listening at http://${hostname}:${port}`);
});

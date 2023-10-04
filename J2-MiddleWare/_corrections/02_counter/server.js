import express from "express";
import session from "express-session"
import { promisify } from 'node:util'

// ==========
// App initialization
// ==========

const hostname = 'localhost';
const port = 8000;

const app = express();

// ==========
// App middlewares
// ==========

app.use(session({
  name: 'COUNTER',
  secret: 'HIDDEN_SECRET_F5F123FDS',
  resave: false,
  saveUninitialized: true
}))

app.use((req, res, next) => {
  if (!req.session.count) {
    req.session.count = 0
  }
  next()
})

// ==========
// App routes
// ==========

app.get("/", (req, res) => {
  if (req.session.count === 10) {
    res.redirect('/check')
    return
  }

  req.session.count++
  res.json({ message: "Hello World", counter: req.session.count });
});

app.get("/check", (req, res) => {
  res.json({ message: `Le compteur est bien arrivé à ${req.session.count} !` })
})

app.get("/delete", async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la déconnexion !')
      return
    }
    res.redirect('/')
  })
})

// ==========
// App start
// ==========

app.listen(port, () => {
  console.log(`App listening at http://${hostname}:${port}`);
});

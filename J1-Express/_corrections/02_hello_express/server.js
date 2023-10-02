import express from "express";
import { fileURLToPath } from "node:url";
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicFolder = path.join(__dirname, 'public')

// Création d'une "application" Express
const app = express();
const port = 8000;

app.use(express.static(publicFolder))

app.get('/', (req, res) => {
  res.send(`<h1>Hello Express!</h1>
  <ul>
  <li><a href="/search/?term=Texte&filterBy=date">/search/?term=Texte&filterBy=date</a></li>
  <li><a href="/user/Dave">/users/Dave</a></li>
  <li><a href="/dont-exists">/dont-exists</a>
  </ul>
  <img src="images/cat.jpg" alt="Chat">
  `)
});

app.get('/user/:name', (req, res) => {
  res.send(`<h1>Hello ${req.params.name}</h1>`)
});

app.get('/search', (req, res) => {
  const { term, filterBy } = req.query;
  res.send(`
    <h1>Recherche de "${term}" filtré par "${filterBy}"</h1>
    <p><a href="/">« Retour</a></p>
  `);
});

app.get('*', (_, res) => {
  res.status(404).send(`<h1>Route introuvable</h1>`)
})

// Démarrage du serveur "Express"
app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}`);
});
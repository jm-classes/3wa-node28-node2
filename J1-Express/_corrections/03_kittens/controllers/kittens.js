import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import path from 'node:path'
import sanitize from 'sanitize-html'

const kittensFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data')

export async function getKittens (req, res) {
  const fileToRead = path.join(kittensFolder, 'kittens.json')

  try {
    const kittens = await fs.readFile(fileToRead)
    const kittensJSON = JSON.parse(kittens.toString())

    let kittensHTML = ''
    for (const { id, name, image } of kittensJSON) {
      const kittenImage = image.startsWith("http")
                            ? image
                            : `/images/${image}`;

      kittensHTML += `<div class="kitten">
                        <a href="/kitten/${id}">${name}</a>
                        <img src="${kittenImage}" alt="Photo de ${name}" />
                      </div>`
    }

    res.send(`<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Kittens - Liste des chatons</title>
        <link rel="stylesheet" href="/css/styles.css" type="text/css" />
      </head>
      <body>
        <div class="container">
          <nav>
            <ul>
              <li>Kittens</li>
              <li><a class="active">Home</a></li>
              <li><a href="/add">Add</a></li>
            </ul>
          </nav>
        </div>
        <div class="container">${kittensHTML}</div>
      </body>
    </html>`)
  }
  catch (err) {
    console.error('Erreur lors de la lecture du fichier', err.message)
    res.status(500).send('Erreur lors de la lecture du fichier')
  }

}

export async function getKitten (req, res) {
  const idChat = req.params.idChat

  const fileToRead = path.join(kittensFolder, `${idChat}.json`)

  try {

    if (!existsSync(fileToRead)) {
      res.status(404).send('Ce chat n\'existe pas')
      return
    }

    const kitten = await fs.readFile(fileToRead)
    const kittenJSON = JSON.parse(kitten.toString())

    const { name, image, age, description } = kittenJSON

    const kittenImage = image.startsWith("http")
                          ? image
                          : `/images/${image}`;

    res.send(`<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Kittens - ${name}</title>
        <link rel="stylesheet" href="/css/styles.css" type="text/css" />
      </head>
      <body>
        <div class="container">
          <nav>
            <ul>
              <li>Kittens</li>
              <li><a href="/">Home</a></li>
              <li><a href="/add">Add</a></li>
            </ul>
          </nav>
        </div>
        <div class="container">
          <div>
            <h2>${name}</h2>
            <p>Age : ${age}</p>
            <p>${description}</p>
            <img src="${kittenImage}" />
          </div>
        </div>
      </body>
    </html>`)
  }
  catch (err) {
    console.log('Erreur lecture fichier', err.message)
    res.status(500).send('Erreur lecture fichier')
  }
}

export function getFormKitten (req, res) {
  // Récupération d'une possible erreur dans l'URL
  const { error } = req.query;

  res.send(`<!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8" />
                  <title>Kittens - Ajouter un chaton</title>
                  <link rel="stylesheet" href="/css/styles.css" type="text/css" />
                </head>
                <body>
                  <div class="container">
                    <nav>
                      <ul>
                        <li>Kittens</li>
                        <li><a href="/">Home</a></li>
                        <li><a class="active">Add</a></li>
                      </ul>
                    </nav>
                  </div>
                  ${(error && error.trim() !== "")
                    ? `<div class="container error">${decodeURIComponent(error)}</div>`
                    : ''
                  }
                  <div class="container">
                  <form action="/add" method="post">
                    Nom : <input type="text" name="name" placeholder="Nyan"><br>
                    Age : <input type="number" name="age" placeholder="2" min="0"><br>
                    Photo : <input type="text" name="image" placeholder="https://placekitten.com/489/640"><br>
                    Description : <input type="text" name="description" placeholder="Super Nyan cat …"><br>
                    <button type="submit">Envoyer</button>
                  </form>
                </div>
              </body>
            </html>`
  )
}

export async function postKitten (req, res) {
  // Extraction des données depuis "req.body" (fourni par express.urlencoded() dans server.js)
  const { name, age, image, description } = req.body

  // Vérification des données envoyées
  if (
    name.trim() === "" ||
    age.trim() === "" ||
    image.trim() === "" ||
    description.trim() === ""
  ) {
    const errorMessage = "Tous les champs sont obligatoires !"
    res.redirect(`/add?error=${encodeURIComponent(errorMessage)}`)
    return;
  }

  if (isNaN(Number(age)) || Number(age) < 0) {
    const errorMessage = "L'age n'est pas valide (entier > 0 uniquement)";
    res.redirect(`/add?error=${encodeURIComponent(errorMessage)}`);
    return;
  }

  if (!image.startsWith("https://placekitten.com")) {
    const errorMessage = "La photo doit provenir du service PlaceKitten";
    res.redirect(`/add?error=${encodeURIComponent(errorMessage)}`);
    return;
  }

  const sanitizedName = sanitize(name)
  const sanitizedDesc = sanitize(description)

  // Si on arrive ici, tout est OK.
  // On va d'abord lire le contenu de "kittens.json" pour en extraire l'ID le plus grand,
  //  et l'incrémenter pour construire le nouvel ID

  const fileToRead = path.join(kittensFolder, 'kittens.json')

  try {
    const kittens = await fs.readFile(fileToRead)
    const kittensJSON = JSON.parse(kittens.toString())

    const lastInsertId = Math.max(...kittensJSON.map(k => k.id))
    const newId = lastInsertId + 1

    const newCat = {
      id: newId,
      name: sanitizedName,
      image,
      age: Number(age),
      description: sanitizedDesc
    }

    // Ajout du chat dans le tableau
    kittensJSON.push(newCat)
    await fs.writeFile(fileToRead, JSON.stringify(kittensJSON, null, 4), 'utf-8')

    // Création du fichier <id>.json avec le contenu du nouveau chaton
    const fileToCreate = path.join(kittensFolder, `${newId}.json`)
    await fs.writeFile(fileToCreate, JSON.stringify(newCat, null, 4), 'utf-8')

    res.redirect('/')
  }
  catch (err) {
    res.status(500).send(`Erreur lors de la création du chat : ${err.message}`);
  }
}
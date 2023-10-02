import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs/promises'
import path from 'node:path'

const kittensFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data')

export async function getKittens (req, res) {
  const fileToRead = path.join(kittensFolder, 'kittens.json')

  try {
    const kittens = await fs.readFile(fileToRead)
    const kittensJSON = JSON.parse(kittens.toString())

    let kittensHTML = ''
    for (const { id, name, image } of kittensJSON) {
      kittensHTML += `<div class="kitten">
                        <a href="/kitten/${id}">${name}</a>
                        <img src="/images/${image}" alt="Photo de ${name}" />
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
            </ul>
          </nav>
        </div>
        <div class="container">
          <div>
            <h2>${name}</h2>
            <p>Age : ${age}</p>
            <p>${description}</p>
            <img src="/images/${image}" />
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
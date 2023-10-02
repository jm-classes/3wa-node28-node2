import express from 'express'
import { fileURLToPath } from 'node:url'
import kittensRouter from './routes/kittens.js'
import path from 'node:path'

const app = express()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

app.use(express.static(path.join(__dirname, 'public')))
app.use(kittensRouter)

app.listen(1337, () => {
  console.log('Le serveur est prêt sur http://localhost:1337')
})
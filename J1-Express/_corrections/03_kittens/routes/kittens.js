import { getKitten, getKittens } from '../controllers/kittens.js'

import { Router } from 'express'

const kittensRouter = Router()

kittensRouter.get('/', getKittens)
kittensRouter.get('/kitten/:idChat(\\d+)', getKitten)

export default kittensRouter
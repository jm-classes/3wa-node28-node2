import { getFormKitten, getKitten, getKittens, postKitten } from '../controllers/kittens.js'

import { Router } from 'express'

const kittensRouter = Router()

kittensRouter.get('/', getKittens)
kittensRouter.get('/kitten/:idChat(\\d+)', getKitten)
kittensRouter.get('/add', getFormKitten)
kittensRouter.post('/add', postKitten)

export default kittensRouter
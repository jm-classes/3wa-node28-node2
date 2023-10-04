import { promisify } from 'node:util'

export default async function logout (req, res) {
  const sessionDestroy = promisify(req.session.destroy.bind(req.session))

  try {
    await sessionDestroy()
    res.redirect('/')
  }
  catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la déconnexion !')
  }
}
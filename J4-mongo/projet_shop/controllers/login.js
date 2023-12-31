import { validate as validateEmail } from 'email-validator'

export function LoginController(req, res) {
  res.render('login')
}

export function PostLoginController(req, res) {
  const emailValidated = validateEmail(req.body.email)
  if (emailValidated) {
    req.session.user = {
      email: req.body.email,
      basket: []
    }
    res.redirect('/')
  }
  else {
    res.status(400).send(`<h1>Erreur !</h1><p>Email invalide !</p>`)
  }
}

export function LogoutController(req, res) {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).send(`<h1>Erreur !</h1><p>${err.message}</p>`)
      return
    }
    res.redirect('/login')
  })
}
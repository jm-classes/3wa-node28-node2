export default function isNotLogged(req, res, next) {
  if (req.session?.user?.isLogged && req.session?.user?.name !== '') {
    res.redirect('/panel/dashboard')
  } else {
    next()
  }
}
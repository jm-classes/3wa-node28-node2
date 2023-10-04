export default function isLogged(req, res, next) {
  if (req.session?.user?.isLogged && req.session?.user?.name !== '') {
    next()
  } else {
    res.redirect('/')
  }
}
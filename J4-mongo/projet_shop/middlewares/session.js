export function setTemplateVars(req, res, next) {
  res.locals.user = req.session?.user ?? null
  next()
}

export function authGuard(req, res, next) {
  if (!req.session?.user) {
    res.redirect('/login')
    return
  }
  next()
}
export function authMiddleware(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Vous devez être authentifié pour accèder à cette page');
    return res.redirect('/login');
  }
  res.locals.loggedUser = req.session.user;
  next();
}

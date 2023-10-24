export default function logout(req, res) {
  req.session.destroy(() => {
    res.redirect('/');
  });
}

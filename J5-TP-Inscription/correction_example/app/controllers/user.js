import { UserModel } from '../Models/User.js';

export async function CreateUserController(req, res) {
  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  try {
    const newUser = await UserModel.createUser(firstName, lastName, email, password, passwordConfirm);

    req.flash(
      'success',
      `Inscription réussie ! Bienvenue sur l'application ${newUser.firstName}<br>Vous pouvez maintenant <a href="/login">vous connecter</a>`
    );
    res.redirect('/');
  } catch ({ message: errorMessage }) {
    return res.status(400).render('home', { errorMessage, values: req.body });
  }
}

export async function LoginUserController(req, res) {
  const { email, password } = req.body;

  try {
    const loggedUser = await UserModel.checkUserCredentials(email, password);

    // Saves user in session
    req.session.user = loggedUser;

    req.flash('success', `Connexion réussie ! Heureux de vous revoir ${loggedUser.firstName}`);
    res.redirect('/dashboard');
  } catch (error) {
    req.flash('error', `Connexion impossible ! ${error.message}`);
    res.redirect('/login');
  }
}

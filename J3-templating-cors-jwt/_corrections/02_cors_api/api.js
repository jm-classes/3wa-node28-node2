import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: false }))

function checkToken(req, res, next) {
  const { token } = req.query
  if (!token) return res.status(403).send({ error: "No token provided !"})
  try {
    // 3. Vérification du token
    const verifiedToken = jwt.verify(token, 'CLE SUPER SECRETE')
    req.token = verifiedToken
    next()
  } catch (err) {
    return res.status(403).send({ error: "Token invalid !"})
  }
}

app.get("/c", checkToken, (req, res) => {
  const token = req.token;

  const users = [
    { name: "Leanne Graham b" },
    { name: "Ervin Howell b" },
    { name: "Clementine Bauch b" },
    { name: "Patricia Lebsack b" },
  ];
  res.json({ users, message: `Bienvenue ${token.name}` });
});

app.get("/login", (req, res) => {
  res.send(`
  <form action="/login" method="post">
    Login : <input type="text" name="username" /><br>
    Password : <input type="password" name="password" /><br>
    <button type="submit">Login</button>
  </form>`)
})

app.post("/login", (req, res) => {
  const { username, password } = req.body
  if (password === '42') {
    // 1. Générer un token d'authentification
    const token = jwt.sign({
      name: username
    }, 'CLE SUPER SECRETE', {
      expiresIn: '60000'
    })

    // 2. Envoi au client
    res.send({
      message: 'Login success!',
      your_token: token
    })
  }
  else {
    res.status(401).send('Mot de passe invalide !')
  }
})

app.listen(process.env.API_PORT, () => {
  console.log(`API ready on : http://${process.env.API_HOST}:${process.env.API_PORT}`);
});

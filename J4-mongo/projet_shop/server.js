import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import route from './routes/routes.js';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

// ==========
// App initialization
// ==========

dotenv.config();
const {
  APP_HOSTNAME,
  APP_PORT,
  NODE_ENV,
  SESSION_SECRET,
  MONGO_STRING,
  MONGO_DB_NAME
} = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set('view engine', 'pug');
app.locals.pretty = NODE_ENV !== 'production'; // Indente correctement le HTML envoyé au client (utile en dev, mais inutile en production)

// ==========
// App middlewares
// ==========

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'NODESHOP_SESSION',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: `${MONGO_STRING}${MONGO_DB_NAME}` })
}));
app.use(express.urlencoded({ extended: false }));

// ==========
// App routers
// ==========

app.use('/', route);

// ==========
// App start
// ==========

try {
  await mongoose.connect(`${MONGO_STRING}${MONGO_DB_NAME}`)
  console.log('✅ Connecté à la base MongoDB')
}
catch (err) {
  console.error('Erreur de connexion', err.message)
}

app.listen(APP_PORT, () => {
  console.log(`✅ Serveur Express prêt sur http://${APP_HOSTNAME}:${APP_PORT}`);
});

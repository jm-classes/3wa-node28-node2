# Session & MongoDB

Dans le cadre d'une mise en **production** nous allons faire une remarque sur la consommation de la mémoire dans l'utilisation des sessions.

Lorsque vous utilisez les sessions avec Express et que vous souhaitez enregistrer des informations dans celles-ci, il faut faire attention à la gestion de la mémoire. En JS vous n'avez pas la possiblité sur un serveur Node.js de stocker des données indéfiniments. C'est pourquoi nous vous conseillons dans le cadre de la mise en production d'une application Express d'utiliser **MongoDB** pour **enregistrer** vos données de session, même de manière temporaire.

## Installation du module connect-mongo

Il existe de nombreuses modules pour faire persister nos sessions en base de données. Pour MongoDB, le module recommandé est **`connect-mongo`** :

```bash
npm install connect-mongo
```

On l'utilise comme suit avec `express-session` :

```js
import session from 'express-session';
import MongoStore from 'connect-mongo';

app.use(session({
  name: 'MyApp Session',
  secret: 'KEEP SECRET FROM CLIENT',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/MyApp' }),
}));
```

On utilise ensuite les sessions de la même façon qu'auparavant, la seule différence au niveau interne est que les données de sessions sont stockées dans la base de données `MyApp` (collection `sessions` par défaut)

Un autre avantage à cela est que si le process Node crashe et redémarre, les sessions ne seront pas perdues.

---

### TD : Optimisation des sessions

Dans le projet **Node Shop**, mettez à jour le middleware `session(...)` afin de stocker les données de sessions dans la base de données `nodeshop`
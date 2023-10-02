# Routeur Express

Nous allons maintenant aborder plus en détail la notion de **routeur**.

En effet, pour de petites applications Express, nous pouvons lister les routes à la suite dans le fichier `server.js` et cela ne pose pas de problèmes :

```js
// FICHIER : server.js
app.get('/', (req, res) => {
  res.send('<h1>Welcome home</h1>');
});

app.get('/contact', (req, res) => {
  res.send('<h1>Contact me</h1>');
});

app.post('/contact', (req, res) => {
  // Send email …
});
```

Mais si l'application grossit, il est alors mieux d'organiser les routes afin de s'y retrouver. C'est là que la notion de **routeur** intervient.

Par défaut, une `app` Express est un routeur, mais il est possible de déclarer explicitement un (ou plusieurs) routeur avec l'avantage de pouvoir le ranger dans un dossier à part :

```js
// FICHIER : ./routers/router.js
import { Router } from "express";

const router = Router();

router.get( … );
router.get( … );
router.post( … );
…

export default router;
```

Pour utiliser le routeur dans l'`app` express du fichier `server.js`, on l'importe désormais comme ceci :

```js
// FICHIER : server.js
import express from "express";
import router from "./routers/router.js";

const app = express();

app.use(router);
// équivaut aussi à : app.use("/", router);

…
```

Cette approche permet de séparer la logique de création et configuration d'Express, avec celle de la gestion des routes applicatives.

Il est même possible pour une application à plus grande échelle d'avoir **plusieurs routeurs** pour des parties différentes :

```js
// FICHIER : server.js
import express from "express";

import appRouter from "./routers/app.js";
import backendRouter from "./routers/backend.js";
import apiRouter from "./routers/api.js";

const app = express();

app.use('/', appRouter);
app.use('/admin', backendRouter);
app.use('/api', apiRouter);

…
```

De cette façon, chaque base de route déclarée par `.use()` sera utilisée en interne par le routeur associé.

# Contrôleur

La notion de **contrôleur** est importante et va de paire avec celle de routeur dans Express.

Un contrôleur est un simple fichier qui regroupe les fonctions utilisées par les routes. On créé généralement un fichier de contrôleur pour un type de ressource (blog post, espace membre, …), et on importe ces fonctions dans le fichier de routeur :

```js
// FICHIER : ./controllers/api.js

const ITEMS = [ /* … */ ];

export function getItems(req, res) {
  res.send(ITEMS);
}

export function getItem(req, res) {
  const item = ITEMS.find(el => el.id === req.params.id);
  if (!item) {
    return res.status(404).send({ error: 'Item not found' });
  }
  return item;
}

export function removeItem(req, res) {
  const index = ITEMS.findIndex(el => el.id === req.params.id);
  if (index < 0) {
    return res.status(404).send({ error: 'Item not found' });
  }
  ITEMS.splice(index, 1);
  res.send(ITEMS);
}

…
```

Dans le routeur associé, nous pouvons maintenant importer les fonctions déclarées dans le contrôleur :

```js
// FICHIER : ./routers/api.js
import { Router } from "express";

// Import des contrôleurs
import { getItems, getItem, removeItem } from "../controllers/api.js";

const apiRouter = Router();

apiRouter.get('/', getItems);
apiRouter.get('/:id', getItem);
apiRouter.delete('/:id', removeItem);

export default apiRouter;
```

**QUESTION : En tenant compte des exemples ci-dessus, à quelle URL le client devra t-il accéder pour <u>afficher l'item n°42</u> du contrôleur de l'API ?**

1. `http://localhost:8000/api/items/42`
2. `http://localhost:8000/items/api/42`
3. `http://localhost:8000/api/42`
4. `http://localhost:8000/42`

---

## 04 Exercice : Kittens controller

Reprenez le projet précédent `/03_kittens/` et refactorez-le de telle sorte à avoir la hiérarchie suivante :

```
03_kittens/
├── routers/
│   └── kittens.js
├── controllers/
│   └── kittens.js
├── data_kittens/…
├── public/…
├── server.js
└── package.json
```

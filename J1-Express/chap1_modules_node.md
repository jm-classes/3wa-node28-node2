# Les modules dans Node

Jusqu'à présent, nous avons utilisé la convention de module par défaut de Node.js, et qui existe depuis sa création : **CommonJS**.

Pour rappel, cette convention décrit l'utilisation des modules comme suit :

```js
// FICHIER : myModule.js
module.exports = "Une valeur ou un objet (littéral, fonction, classe, array …)";

// FICHIER : index.js
const valeur = require('./myModule');
```

Nous utiliserons à partir de maintenant la nouvelle convention : les **ES Modules** (abrégé **ESM**), présents dans le standard ECMAScript 2015.

Cette convention permet l'utilisation des déclarations `import …` et `export …`.

Node.js a introduit à partir de la `v8.5.0` le support expérimental des **ESM**. Il fallait alors utiliser le flag `--experimental-modules` avec la commande `node` : `node app.js --experimental-modules`.

Depuis la `v13.2.0`, le support est considéré comme stable et ne nécessite aucun flag.

⚠️ **Cependant** pour des raisons techniques internes liées à la façon dont sont chargés les modules en mémoire, il y a 2 possibilités distinctes pour pouvoir utiliser les ESM dans Node.js :

1. Soit utiliser l'extension `.mjs` (au lieu de `.js`)
2. Soit définir l'option `{ "type" : "module" }` dans le fichier `package.json` à la racine du projet.

On préfèrera pour ce cours la seconde option.

Nous pouvons donc utiliser les marqueurs `import` et `export` tels que définis par le standard ECMAScript dans les modules Node :

```js
// FICHIER : package.json
{
  …
  "type" : "module"
}
```

```javascript
// FICHIER : countModule.js
let count = 0;

export default function getCount() {
  return count;
}

export function incrementCount(c) {
  count += c;
}
```

```javascript
// FICHIER : index.js
import getCount, { incrementCount } from './countModule.js';

getCount(); // 0
incrementCount(40);
incrementCount(2);
getCount(); // 42
```

> **⚠️ Attention !**
> Contrairement à CommonJS jusqu'ici, il est obligatoire de préciser l'extension `.js` avec l'import.
> Notez aussi l'absence des accolades `{}` qui indique que l'on souhaite récupérer le membre exporté _par défaut_ depuis `countModule.js`

---

Aujourd'hui, il est donc possible de choisir 2 stratégies de chargement de modules au sein d'une app Node.js (*CommonJS* ou *ES Modules*).

*ESM* ne rend pas pour autant *CommonJS* obsolète. Même si la syntaxe des *ESM* est plus moderne et plus agréable à utiliser, [elle ne fait pas l'unanimité](https://gist.github.com/joepie91/bca2fda868c1e8b2c2caf76af7dfcad3). De plus, les packages publiés sur la base de registre NPM ne sont pas toujours compatibles *ESM*.

Libre à vous de choisir donc le style de modules utilisés dans vos futurs projets Node.js.

Dans ce cours, nous choisirons d'utiliser les modules *ESM*.
## Initialisation de Node.js avec ESM

Afin de tester les ESM dans Node.js de façon native, nous allons mettre en place une base de projet simple.

Créez un nouveau dossier `/01_hello_modules/` et initialisez un projet Node.js.

Pour rappel, on initialise un nouveau projet par la création d'un fichier `package.json`, que l'on peut générer à l'aide de la commande suivante :

```bash
npm init -y
```
> N'oubliez pas de vous placer à la racine du dossier `/01_hello_modules/`

Nous allons également installer `nodemon` et définir un script de démarrage :

```bash
npm install nodemon --save-dev
```

```json
"scripts": {
  "start": "nodemon index.js"
},
```

Pensez également à changer le nom du point d'entrée dans le fichier package.json de votre application :

```json
"main": "index.js",
```

## 01 Exercice : Hello Modules

> ℹ Vous n'avez pas besoin pour cet exercice de créer un serveur Node.js comme vu en cours précédemment, mais simplement tester la syntaxe ESM d'import/export de fichiers pour voir si tout est bien configuré.

Dans votre dossier `/01_hello_modules/`, créez l'arborescence suivante :

```
.
├── utils/
│   └── hello.js
└── index.js
```

Dans `hello.js`, déclarez la fonction JS `hello`, qui prendra un unique argument `message` qu'elle renverra comme ceci, et suivez les consignes en commentaire  :

```js
// 1. Marquez cette fonction comme étant exportable
function hello (message) {
  return `Hello ${message}`;
}
```

Dans le fichier `index.js`, importez la fonction :

```js
// 2. Importez ici la fonction "hello"

console.log(hello("World!"));
```

Lancez l'application avec `npm start` pour afficher le log.

Si tout est bien configuré, vous devriez voir le message « Hello World! ».

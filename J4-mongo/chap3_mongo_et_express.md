# Express et Mongo

De la même manière qu'avec `mongosh`, on peut se connecter à une base de données MongoDB depuis une application **Express**

Un des package NPM les plus simples pour cela, et qui reprend la même API que MongoShell, est le [**MongoDB Node.js Driver**](https://www.npmjs.com/package/mongodb).

Cependant, nous allons dans ce cours utiliser un ODM (Object Document Mapping) : c'est une sorte d'ORM, mais pour les bases non-relationnelles.

L'ODM le plus connu pour MongoDB dans Node est [**mongoose**](https://mongoosejs.com/)

# Mongoose

Nous allons aborder MongoDB en utilisant une couche d'abstraction (mongoose) pour l'intégrer dans Express.

Mongoose utilise les Promesses JS. Nous utiliserons par la suite la syntaxe `async/await` de JavaScript pour manipuler ces promesses.

## Mongoose : Installation & exemple

On installe mongoose simplement via NPM :

```bash
npm install mongoose
```

On l'initialise comme ceci :

```js
import mongoose from 'mongoose';

try {
  await mongoose.connect('mongodb://localhost:27017/nodeshop')
  console.log('✔️ Connecté à la base MongoDB')
}
catch (err) {
  console.error('Erreur de connexion', err.message)
}
```

> **Note**
> `mongoose` est un [_singleton_](https://fr.wikipedia.org/wiki/Singleton_(patron_de_conception)), c'est à dire qu'il récupére la même instance à chaque `import` dans les différents modules `.js`, ce qui est très pratique pour le découpage du code au niveau applicatif.

### TD 1 : Connexion à la base

Dans le projet **Node Shop**, ouvrez le fichier `_tools/seed.js` et effectuez l'action suivante :

```js
// @todo: Se connecter à Mongoose sur la BDD "nodeshop"
```

_(Ne faites pas les autres actions pour l'instant)_

Pour vérifier votre script, vous pouvez l'exécuter avec la commande suivante :

```bash
npm run db:seed
```

_(ℹ️ Cette commande est déclarée dans le `package.json` du projet)_

---

## Schemas et Modèles

Le principal intérêt d'utiliser Mongoose est pour la définition de **schémas** et de **modèles**.

### Schema

Un Schema est une *définition de la structure d'un document*. Il est composé de champs et de types de données.

Admettons ce document représentant un chat :

```js
{
  id: 3,
  name: "Nyan",
  image: "nyan.jpg",
  dateBirth: 1696485029000,
  description: "super cat"
}
```

Le Schéma mongoose correspondant peut être défini comme suit :

```js
const CatsSchema = new mongoose.Schema({
  id          : { type: Number, required: true },
  name        : { type: String, required: true },
  image       : String,
  dateBirth   : { type: Date, default: Date.now },
  description : String,
});
```

Il est même possible de prévoir des validations supplémentaires, par exemple pour le champ `dateBirth` :

```js
...

  dateBirth: {
    type: Date,
    default: Date.now,
    validate: {
      validator: (value) => value < Date.now(),
      message: 'La date doit être antérieure à aujourd\'hui',
    },
  },

```

### Modèle

Un modèle est une **classe** qui permet de manipuler des documents. Lors de sa création, il se base sur un Schéma :

```js
const CatModel = mongoose.model('Cats', CatsSchema, 'cats');
```

> Le premier paramètre est le **nom du modèle**, le second est **le schéma sur lequel il se base**, et le troisième est le **nom de la collection** dans laquelle il va chercher les documents.

Une fois le modèle créé vous pouvez par exemple vous en servir pour créer un nouveau document, que vous enregistrez dans votre base données comme suit :

```js
const newCat = {
  id: 3,
  name: 'Nyan',
  image: 'nyan.jpg',
  dateBirth: 1696485029000,
  description: 'super cat'
};

// Sauvegarde du document en base
try {
  const doc = await CatModel.create(newCat);
  console.log(doc);
} catch (err) {
  console.error('Erreur d\'insertion', err.message);
}
```

Pour vérifier que le document est bien enregistré, on peut utiliser la méthode `find`. Elle s'utilise comme un *find* dans MongoDB, avec la même syntaxe :

```js
try {
  const docs = await CatModel.find({});
  console.log(docs); // Tableau de documents 'Cat'
} catch (err) {
  console.error('Erreur de récupération', err.message);
}
```

On peut aussi supprimer tous les documents d'une collection avec la méthode `deleteMany` :

```js
try {
  const result = await CatModel.deleteMany({});
  console.log(result); // { n: 1, ok: 1, deletedCount: 1 }
} catch (err) {
  console.error('Erreur de suppression', err.message);
}
```

Les modèles Mongoose proposent de nombreuses méthodes pour manipuler les documents, comme `findOne`, `findById`, `updateOne`, `updateMany`, `deleteOne`, `deleteMany`, etc.

On les retrouve toutes sur la documentation : [https://mongoosejs.com/docs/models.html](https://mongoosejs.com/docs/models.html)

### TD 2 : Seed de données

Toujours dans le projet **Node Shop**, complétez le code du fichier `_tools/seed.js` pour effectuer les actions suivantes :

```js
// @todo: Définir le schéma de la collection "products"
// @todo: Vider la collection "products"
// @todo: Remplir la collection "products" avec les données dans '_data/products.json'
// @todo: Afficher un message de confirmation
```

> **Note** Vous pouvez récupérer les données à insérer depuis le fichier `_data/products.json` :

```js
import data from '../_data/products.json' assert { type: 'json' }
```

Une fois votre script terminé et lancé, vous utiliserez `mongosh` pour aller voir dans votre base si les produits ont bien été insérés.
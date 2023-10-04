# Commandes du client MongoShell

MongoSH (MongoShell) est un programme client permettant de se connecter à une base MongoDB.

Lorsque vous tapez `mongosh`, ce programme va se connecter à la base Mongo existante sur votre machine. Si aucun identifiants n'est fourni, le programme va tenter de trouver la base sur `localhost` avec le port `27017` par défaut.

Docker faisant tourner cette base, `mongosh` pourra alors s'y connecter 👍

---

Une fois dans le programme MongoShell, vous avez accès à diverses commandes. Par exemple, pour quitter le programme, vous taperez :

```bash
quit()  # équivalent : exit
```

Voici d'autres commandes auxquelles vous avez accès :

```js
// Affichez les bases de données
show dbs

// Connexion et/ou création d'une base de données "restaurants"
use restaurants

// Connaitre le nom de la base de données sur laquelle on est connecté
db

// Créer une collection vide "addresses"
db.createCollection('addresses')

// Voir les collections existantes de la 'db'
show collections

// Insérer un document dans une collection
db.addresses.insertOne(
  {
    name: 'Indiana Coffee',
    location: '4th Baker Street, London'
  }
)

// Voir la liste des documents dans une collection
db.addresses.find()

// Renommer une collection "addresses" en "address"
db.addresses.renameCollection("address")

// ex: Supprimer l'ensemble des documents dans une collection
db.address.deleteMany({})

// Supprimer physiquement une collection
db.address.drop()

// Supprimer la base de données actuelle
//  ⚠ Cela supprimera également toutes les collections dans cette base !
db.dropDatabase()


// Efface la console
cls
```

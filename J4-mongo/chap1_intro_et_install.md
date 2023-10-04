# MongoDB : Introduction

MongoDB est une base de données NoSQL (Not Only SQL) crée en 2007, mature et orientée document (fichier BJSON).

MongoDB est un DSL (Domain-Specific Language), il n'utilise pas le paradigme SQL, mais un langage original dédié à l'interrogation des données.

Il est adapté au stockage de données **massives** qui peuvent varier dans le temps, son DSL est puissant et permet d'interroger les données facilement. Notez que lorsque la structure des données est connues au préalable et ne bouge pas dans le temps on utilisera de préférence du SQL.

Dans un projet d'application Web vous serez amené à travailler avec les **deux** paradigmes SQL et NoSQL, par exemple MySQL et MongoDB.

Enfin, MongoDB propose un ensemble important de drivers pour les langages comme PHP, JS, Python, ... Comme par exemple MySQL.

## Document et collection

Dans une base de données MongoDB vous manipulerez des **documents**, fichiers semi-structurés BJSON dont les propriétés sont typées. BJSON est un **binaire** qui permet d'interroger les données plus rapidement.

Les documents sont stockés dans une collection qui se trouve dans une base de données sur un serveur MongoDB.

## Modélisation des données

MongoDB n'impose **aucun schéma de données** par défaut, il est orienté flexibilité. Les collections n'ont pas de structure pré-déterminée ou fixe, elles peuvent donc **évoluer dans le temps**. Dans un document, des champs peuvent être ajoutés, supprimés, modifiés et renommés à tout moment ...

Le modèle des documents est basé sur un système de **clés/valeurs**. Chaque valeur peut être de type scalaire, c'est-à-dire des numériques, chaîne de caractères, boléens ou la valeur particulière `null`. Ces valeurs peuvent également comporter des listes de valeurs ou même des documents imbriqués.

Ci-dessous un exemple représentant une collection de 2 documents :


```json
{
  // Collection
  "students": [

    // Document 1
    {
      "_id": 1,
      "name": "Alan",
      "address": {
        "street": "London",
        "city": "London",
        "zip": " 31413"
      },
      "grade": "master 5",
      "notes": [14, 17, 19, 20],
      "relationship": null
    },

    // Document 2
    {
      "_id": 2,
      "name": "Alice",
      "address": "Paris",
      "grade": "master 4",
      "notes": [19, 11, 20],
      "relationship": [1]
    }

  ]
}

```

Comme vous le voyez, deux documents d'une même collection peuvent avoir des champs qui diffèrent. Cela apporte une grande flexibilité aux données que l'on veut stocker.

Remarque : chaque document possède obligatoirement une clé unique `_id`, le type de cette propriété est par défaut **ObjectId**, mais peut être de n'importe **quel type scalaire**. La valeur de ce champ doit cependant **être unique** dans le document et bien sûr non mutable. Vous ne pouvez pas définir par exemple cette clé avec un array ou un objet qui sont des valeurs mutables.

# Installation de MongoDB

**Windows, macOS, Linux ?**

Si vous êtes sous **macOS** ou **Linux**, il est plus pratique d'utiliser Docker pour mettre en place une base Mongo dans un conteneur.

Si vous êtes sous **Windows** (<u>et que vous n'avez pas déjà Docker d'installé</u>), il est préférable d'installer MongoDB manuellement.

Voici les deux procédures différentes :

## 1.a. Docker (procédure recommandée)

Vous devez au préalable avoir Docker installé sur votre système avant de continuer : https://docs.docker.com/get-docker/

Afin de démarrer un conteneur hébergeant MongoDB, lancez la commande suivante :

```bash
docker-compose up -d
```

> **Warning**
> Assurez-vous d'être placé dans le répertoire contenant le fichier `docker-compose.yml`

Cette commande va démarrer une base de données MongoDB sur le port `27017` de votre machine (par défaut celui utilisé par MongoDB).

Vous pourrez vous y connecter avec n'importe quel client MongoDB (y compris Express)

En attendant, vous utiliserez le terminal pour y accéder :

```bash
docker exec -it mongoshop bash
```

Vous entrez ici dans un shell du conteneur Docker nommé `mongoshop` :

```
root@7a4b27102da3:/# 
```

Tapez ensuite la commande `mongosh` :

```
root@7a4b27102da3:/# mongosh
```

Vous obtenez le résultat suivant :

```
Current Mongosh Log ID: 651ddce030380dd034df6070
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1

...

test>
```

Si vous arrivez jusqu'ici, votre base MongoDB est prête !


---

## 1.b. Windows (si vous n'avez pas le choix)

Vous pouvez installer MongoDB en utilisant l'installeur officiel **MongoDB Community Server** :

https://www.mongodb.com/try/download/community

**ATTENTION** : Veillez à choisir l'installation **Custom** et non complète, puis choisissez **et notez** l'emplacement des fichiers et dossiers de Mongo dans votre système (par défaut : `C:\Program Files\MongoDB\Server\`).
Choisissez l'installation de MongoD en tant que Service, et **n'installez pas MongoDB Compass** : c'est une interface graphique pour Mongo qui peut être installée séparament. Mais nous utiliserons la ligne de commande pour dialoguer avec Mongo dans ce cours.

Une fois l'installation terminée, ouvrez un terminal et vérifiez que vous avez accès à la commande `mongo` en tapant : `mongo --version`.

Si vous obtenez une erreur type *- commande non reconnue -*, il faut alors modifier votre variable d'environnement `Path` :

1. Ouvrez le menu "Démarrer"
2. Tapez *"Modifier les variables d'environnement système"*
3. Cliquez sur le bouton *"Variables d'environnement..."*
4. Cliquez sur la variable `Path` dans la liste des variables utilisateur et cliquez sur "Modifier"
5. Créez une nouvelle entrée contenant le chemin vers `/bin` à l'emplacement où vous avez installé Mongo (par défaut : `C:\Program Files\MongoDB\Server\<VOTRE_VERSION>\bin`)
6. Refermez toutes les fenêtres en appuyant sur OK.
7. Relancez **complètement** votre terminal et tapez à nouveau la commande `mongo --version`


Mongo dispose de 2 éléments :

- Le serveur de base de donnée (`mongod.exe`).
- Le client (`mongo.exe`) pour se connecter au serveur.

Comme vous avez installé MongoD en tant que Service, vous n'aurez pas besoin de lancer manuellement le serveur 👍.

### Mongo SH

Le programme Mongo Shell (`mongosh.exe`) est une version modernisée du CLI installé par défaut avec MongoDB (`mongo.exe`).

Cette installation n'est pas obligatoire mais plutôt conseillée pour avoir des couleurs et des options supplémentaires pour manipuler vos bases de données.

[Installer Mongo Shell](https://www.mongodb.com/try/download/shell)

Une fois installé, ouvrez un terminal et connectez-vous à votre serveur MongoDB :

```bash
mongosh
```

Vous obtenez le résultat suivant :

```
Current Mongosh Log ID: 651ddce030380dd034df6070
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.1

...

test>
```

Si vous arrivez jusqu'ici, votre base MongoDB est prête !
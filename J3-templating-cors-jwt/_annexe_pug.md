# Templating

Générer manuellement le HTML côté serveur est pratique, mais lorsqu'on travaille avec des applications à plus grande échelle, cela devient tout de suite plus difficile à maintenir.

Nous avons pour cela besoin d'un **moteur de templating**.

Un moteur de templating propose au développeur une syntaxe permettant d'écrire du code HTML avec des instructions dynamiques (conditions, boucles, inclusions , …).

Cette syntaxe est ensuite passée au moteur de templating avec un set de données, et le moteur va se charger de transformer le tout en String HTML statique, laquelle pourra être ensuite passée au client.

Par exemple, le langage PHP permet nativement de faire du templating avec du HTML :

```html+php
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title><?= $pageTitle; ?></title>
</head>
<body>
    <?php foreach ($articles as $article) : ?>
        <h1><?= $article->title; ?></h1>
        <p><?= $article->content; ?></p>
    <?php endforeach; ?>
</body>
</html>
```

Il n'existe pas de mécanisme similaire nativement dans Node.js. Il faut passer par des modules tiers qui proposent des moteurs de templating.

En voici quelques-uns :

- [Pug](https://pugjs.org/) (anciennement **Jade**)
- [EJS](https://ejs.co/)
- [Handlebars](https://handlebarsjs.com/)
- [Haml](https://haml.info/)
- [Twing](https://www.npmjs.com/package/twing)

Dans ce cours, nous utiliserons un des plus populaires : **Pug**.

---
## Compilation et rendu

Pour commencer, il faut installer Pug :

```bash
npm install pug
```

Pug fournit 2 méthodes principales :

1. `compile()` : Prend une string de template en entrée et renvoie une fonction de compilation spécifique à ce template, qui permet d'obtenir un rendu. C'est très pratique pour les performances car on peut **pré-compiler** le template et mettre la fonction en cache si le modèle ne change pas.

```js
const pug = require('pug');

const template = `
if age >= 18
    h1 Access granted!
else
    h1 Permission denied!`;

const compileTemplate = pug.compile(template);

compileTemplate({ age : 19 });
// Renvoie: 
// <h1>Access granted!</h1>
```

On peut aussi placer le template dans un fichier externe `.pug` et le compiler avec `.compileFile()` :

```pug
// template.pug
if age >= 18
    h1 Access granted!
else
    h1 Permission denied!
```

```js
// server.js
const pug = require('pug');

const compileTemplate = pug.compileFile('template.pug');

compileTemplate({ age : 19 });
```

2. `render()` : Permet de compiler et de rendre le contenu en un seul coup. C'est plus simple à utiliser mais il faut savoir qu'à chaque appel, le template est **recompilé** puis rendu, ce qui peut impacter les performances inutilement si le template d'origine ne change pas.

Attention pour cette méthode, la fonction de callback est appelée de façon **synchrone !**

```js
const template = `
if age >= 18
    h1 Access granted!
else
    h1 Permission denied!`;

pug.render(template, { age : 19 }, (err, data) => {
    if (err) throw err;
    console.log(data);
});
```

On peut aussi utiliser `.renderFile()` pour utiliser un fichier `.pug` :

```js
pug.renderFile('template.pug', { age : 19 }, (err, data) => {
    if (err) throw err;
    console.log(data);
});
```

### Gérer les erreurs

Comme toute opération en programmation, une erreur peut se produire lors de la compilation et/ou du rendu du template.

Pour gérer les éventuelles erreurs provoquées par `compile` et `compileFile`, on peut utiliser un bloc `try/catch` :

```js
try {
    const compileTemplate = pug.compile(template);
    // …
} catch (err) {
    res.writeHead(500, { 'Content-Type' : 'text/plain' });
    res.end( err.message );
}
```

Pour les méthodes `render` et `renderFile`, on peut se servir de la fonction de callback pour récupérer une potentielle erreur :

```js
pug.renderFile('template.pug', { age : 19 }, (err, data) => {
    if (err) {
        res.writeHead(500, { 'Content-Type' : 'text/plain' });
        res.end( err.message );
    }
});
```

Attention pour cette méthode, la fonction de callback est toujours appelée de façon **synchrone !**

#### Exercices
**01. Écrire un script Node.js qui implémente `renderFile` et qui permet de rendre le template suivant. L'objet `user` passé au template doit contenir la valeur suivante : `{ isAdmin: true }`**
```pug
if user.isAdmin
    h1 Access granted
else
    h1 You must be logged as an administrator!
```
(Vérifiez que le résultat du rendu change bien si vous passez `isAdmin` à `false`)

**02. Ré-écrire le même programme en utilisant cette fois la méthode `compileFile`.**
# Syntaxe Pug de base

Pug propose une syntaxe simplifiée et expressive, permettant au développeur de créer des templates HTML épurés sans fioritures de langage comme les chevrons, les point-virgules, accolades ou parenthèses.

**⚠ Attention** ! C'est un langage basé sur **l'indentation** (comme le langage Python par ex.). Une mauvaise indentation entraînera une erreur de compilation !

## Ecrire du HTML standard

On écrit les balises HTML sans les chevrons `< >`. Chaque niveau d'indentation équivaut à une imbrication :

```pug
nav
    ul
        li
            a(href='/home') Home
        li
            a(href='/portfolio') Portfolio
        li
            a(href='/contact') Contact
```

sera compilé vers :

```html
<nav>
    <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/portfolio">Portfolio</a></li>
        <li><a href="/contact">Contact</a></li>
    </ul>
</nav>
```

Pour sauver de l'espace d'affichage, Pug propose une syntaxe inline plus lisible pour les tags imbriqués :

```pug
nav: ul
    li: a(href='/home') Home
    li: a(href='/portfolio') Portfolio
    li: a(href='/contact') Contact
```

Les attributs s'écrivent entre parenthèses :

```pug
input(type='radio' name='gender' value='Male')

//- où sur plusieurs lignes
input(
    type='radio'
    name='gender'
    value='Female'
    checked
)
```

```html
<input type="radio" name="gender" value="Male"/>
<input type="radio" name="gender" value="Female" checked="checked"/>
```

On peut également utiliser la syntaxe des sélecteurs CSS pour gérer les attributs `class` et `id` :

```pug
main#container
    article
        .article-inner
            p.
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Nisi voluptatum maiores laboriosam accusamus

            //- Ici le `p.` indique un bloc de texte standard sur plusieurs lignes
```

va générer :

```html
<main id="container">
    <article>
        <div class="article-inner">
            <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Nisi voluptatum maiores laboriosam accusamus
            </p>
        </div>
    </article>
</main>
```

Pour de petites inclusions de tags HTML, Pug autorise l'écriture classique :

```pug
p Ceci est un texte à <strong>forte emphase</strong>

//- Équivalent à :

p Ceci est un texte à 
    strong forte emphase
```

```html
<p>Ceci est un texte à <strong>forte emphase</strong></p>
```

On peut aussi écrire du texte standard sur une ligne avec l'opérateur pipe `|` :

```pug
div
    p Je suis dans le paragraphe 
    | Je suis en dehors du paragraphe
```
```html
<div>
    <p>Je suis dans le paragraphe </p>
    Je suis en dehors du paragraphe
</div>
```

## Interpolation

L'intérêt primaire d'un moteur de templating est de pouvoir interprêter des variables et les afficher dans le rendu final, via l'interpolation.

Dans Pug, on passe les variables à la vue sous forme d'objet :

```js
const compileTemplate = pug.compileFile('template.pug');

const data = {
    name: 'JM',
    age: 33,
    gender: 'M'
};

compileTemplate(data);
```

L'interpolation côté templating se fait avec le marqueur suivant : `#{expression}`

```pug
h1 Hello #{name}
p Your age is #{age} and you are a #{gender}
```

Lorsqu'une balise HTML ne contient que la valeur d'une expression et rien d'autre, on peut utiliser le raccourci avec `=` :

```pug
h1 Hello #{name}

p Your age is:
    output= age

select
    option(value=gender)= gender
```

Affichera :
```html
<h1>Hello JM</h1>

<p>Your age is: <output>33</output></p>

<select>
    <option value="M">M</option>
</select>
```

Par défaut, les valeurs interpolées sont automatiquement échappées pour éviter les attaques de type XSS :

```pug
- const sensitiveData = `<script>alert('XSS')</script>`;

div= sensitiveData
//- div #{sensitiveData}
```
```html
<div>&lt;script&gt;alert('XSS')&lt;/script&gt;</div>
```

Dans certains cas, **si on sait ce que l'on fait**, on peut désactiver l'échappement automatique avec un `!` :

```pug
- const text = `<b>Hello there!</b>`;

div!= text
//- div !{text}
```

```html
<div><b>Hello there!</b></div>
```

## Écrire du code JS

On a parfois besoin d'écrire du code JS pour de petites instructions, notamment pour le formatage de donnée, ou pour faire de la décomposition et rendre le template plus lisible.

On utilise pour ça le trait d'union `-`

```pug
article
    - const { title, date, author } = post
    h1= title
    p Written by #{author}
    time(datetime=date.toISOString())= date.toLocaleDateString()
```

Donnera le rendu suivant :

```html
<article>
    <h1>Le templating avec Pug</h1>
    <p>Written by 3WAcademy</p>
    <time datetime="2022-04-19T13:37:30.000Z">19/04/2022</time>
</article>
```

Parfois, on a besoin d'écrire des blocs de code sur plusieurs lignes :

```pug
article
    -
        const { title, date, author } = post;
        const ISODate = date.toISOString();
        const formattedDate = date.toLocaleDateString();

    h1= title
    p Written by #{author}
    time(datetime=ISODate)= formattedDate
```

Enfin, si on veut écrire du code JS qui sera interprêté côté client, on le place simplement dans un tag `script` que l'on précède par un point :

```pug
input(type='text' id='message')
p Hello <span id="messageValue"></span>

script.
    const messageEl = document.getElementById('message');
    const span = document.getElementById('messageValue');
    messageEl.oninput = function (event) {
        span.textContent = event.target.value;
    };
```

Génèrera :

```html
<input type="text" id="message"/>
<p>Hello <span id="messageValue"></span></p>
<script>
    const messageEl = document.getElementById('message');
    const span = document.getElementById('messageValue');
    messageEl.oninput = function (event) {
        span.textContent = event.target.value;
    };
</script>
```

## Conditions, commentaires

Le moteur supporte les conditions basiques :

```pug
if results
    if results.length > 1
        p Il y a #{results.length} résultats de recherche
    else if results.length === 1
        p Il y a 1 unique résultat
    else
        p Aucun résultat
else
    p Aucune recherche effectuée …
```

Il propose aussi un raccourci pour la négation :

```pug
unless user.logged
    p Veuillez vous authentifier

//- Parfaitement équivalent à :

if !user.logged
    p Veuillez vous authentifier
```

On peut également faire d'un `switch/case` en JS avec les mots-clé `case/when` de Pug :

```pug
case user.gender
    when 'M'
        p Male
    when 'F'
        p Female
    default
        p No gender specified

//- À noter que les *break* sont implicites pour chaque `when`.
```


Les commentaires peuvent être côté Pug, ou côté HTML :
```pug
div.commentaires
    //- Ce commentaire pug NE sera PAS affiché dans le rendu
    // Mais celui-ci oui !
```

```html
<div class="commentaires">
    <!-- Mais celui-ci oui !-->
</div>
```

#### Exercice

**03. Dans un template, utiliser l'objet JS suivant et passez-le à un template `.pug` :**
```js
const loggedUser = {
    name: {
        first: 'Jean',
        last: 'Dupont',
    },
    age: 36,
    birthdate: new Date('1986-04-18'),
    location: {
        zipcode: '77420',
        city: 'Champs-sur-Marne',
    },
    isAdmin: true
};
```

Le HTML généré devra être le suivant :
```html
<div class="user-card">
    <h4>Jean DUPONT <small>(36 ans)</small></h4>
    <p>Né le 18/04/1986</p>
    <p>Vit à <strong>Champs-sur-Marne, 77420</strong></p>
    <span class="badge-admin">Est administrateur</span>
</div>
```

> Astuce: Afin d'obtenir un résultat visuel correctement indenté en HTML, vous pouvez passer l'option `{ pretty: true }` à **renderFile** et **compileFile**. Attention, cette option n'est pas recommandée en production, mais nous l'utiliseront ici pour vérifier le résultat des exercice

---

## Boucles

Pug propose un mot-clé `each` pour itérer sur des tableaux `[]` ou objets `{}` JavaScript :

```pug
- const users = ['JM', 'Antoine', 'Marion'];
ul#users
    each user in users
        li #{user}
```

rendra :

```html
<ul id="users">
    <li>JM</li>
    <li>Antoine</li>
    <li>Marion</li>
</ul>
```

On peut également récupérer l'indice du tableau :
```pug
each user, index in users
    li #{user} (#{index})
```

**⚠ Attention !** Seuls les tableaux et objets littéraux sont concernés. En effet, `each` n'est pas capable de boucler sur des objets JavaScript itérables qui implémentent le `Symbol.Iterator`, tels que des `Set` ou des `Map`. Pour ça, il faut utiliser une boucle `for … of` classique :

```pug
ul#users
    - const users = new Set(['JM', 'Antoine', 'Marion']);

    - for (const user of users)
        li= user
```

On peut aussi faire un `while` simple :

```pug
- let i = 1;

while i <= 10
    div= i

    - i++
```

```html
<div>1</div>
<div>2</div>
<div>3</div>
<div>4</div>
<div>5</div>
<div>6</div>
<div>7</div>
<div>8</div>
<div>9</div>
<div>10</div>
```

## Mixins

Les mixins s'inspirent du pattern DRY (Don't Repeat Yourself). Il s'agit de simples *fonctions* qui répètent un morçeau de HTML. On les déclare avec le mot-clé `mixin` et on les utilise en les précédent de l'opérateur `+` :

```pug
mixin menuItem
    li: a(href='#') Menu item

ul
    +menuItem
    +menuItem
    +menuItem
```

rendra :

```html
<ul>
    <li><a href="#">Menu item</a></li>
    <li><a href="#">Menu item</a></li>
    <li><a href="#">Menu item</a></li>
</ul>
```

Les mixins peuvent prendre des arguments :

```pug
mixin menuItem(url, title)
    li: a(href=url)= title

ul
    +menuItem('/', 'Home')
    +menuItem('/references', 'Réalisations')
    +menuItem('/contact', 'Me contacter')
```
```html
<ul>
    <li><a href="/">Home</a></li>
    <li><a href="/references">Réalisations</a></li>
    <li><a href="/contact">Me contacter</a></li>
</ul>
```

Il est possible d'ajouter à la suite les attributs passés à la mixin :

```pug
mixin listItem(value)
    li&attributes(attributes)= value
    //- 'attributes' est un argument disponible dans chaque mixin

ul
    +listItem('One')(class="odd")
    +listItem('Two')(class="even" title="I'm even")
    +listItem('Three')(class="odd")
```
```html
<ul>
    <li class="odd">One</li>
    <li class="even" title="I'm even">Two</li>
    <li class="odd">Three</li>
</ul>
```

Les mixins sont très pratiques pour éviter de répéter de gros blocs de code HTML. On peut les voir comme des Stateless Components (aussi appelés Presentational Components) en React.js

## Inclusions et Layouts

Comme tous les moteurs de templating modernes, il est possible de séparer ses templates en plusieurs morçeaux afin d'améliorer le découpage.

Dans Pug, on utilise l'instruction `include`. Les chemins sont relatifs par rapport au fichier qui fait l'inclusion.

```pug
//- Fichier principal
header
    include menu.pug
main.container
    h1 Welcome Home!
```

```pug
//- Fichier "menu.pug"
nav: ul
    li: a(href="/") Home
    li: a(href="/references") References
    li: a(href="/contact") Contact
```

Le rendu du fichier principal donnera :

```html
<header>
    <nav>
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/references">References</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>
    </nav>
</header>
<main class="container">
    <h1>Welcome Home!</h1>
</main>
```

Les inclusions sont pratiques pour de petits morçeaux de fichiers, mais parfois on a besoin de plus de flexibilité pour travailler avec des pages web complètes.

Assembler manuellement tous les éléments d'une page web comme un *Doctype*, des menus (souvent dynamiques), des headers, des footers, des scripts clients, des styles, … peut vite se transformer en découpage complexe et rendre le template difficilement adaptable pour tous les cas de figure.

Pour cela, on utilise plutôt le principe de **layouts**.

Un layout est un squelette de page web, dans lequel on peut déclarer des `block`. Par exemple, soit le fichier de layout suivant, nommé `frontend-layout.pug` :

```pug
//- frontend-layout.pug

doctype html
html(lang="fr")
    head
        meta(charset="UTF-8")
        title My Layout

        link(rel="stylesheet" href="https://unpkg.com/bootstrap@5.1.3/dist/css/bootstrap.min.css")
        block styles

        script(src="https://polyfill.io/v3/polyfill.min.js")
        block scripts
    body
        
        header: nav: ul
            li: a(href="/") Home
            li: a(href="/references") References
            li: a(href="/contact") Contact

        block content

        footer © Copyright, Tous droits réservés
```

Les 3 blocks `styles`, `scripts` et `content` permettront d'accueillir du contenu déclaré par d'autres fichiers qui **se baseront sur ce layout**.

On peut maintenant créer un autre fichier qui va se baser sur ce layout grâce au mot-clé `extends` :

```pug
extends frontend-layout.pug

block styles
    link(rel="stylesheet" href="flexslider.css")

block scripts
    script(src="flexslider.js")

block content
    h1 Bienvenue sur la page d'accueil
```

Le rendu de la page ci-dessus donnera le résultat suivant :

```html
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>My Layout</title>
        <link rel="stylesheet" href="https://unpkg.com/bootstrap@5.1.3/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="flexslider.css">
        <script src="https://polyfill.io/v3/polyfill.min.js"></script>
        <script src="flexslider.js"></script>
    </head>
    <body>
        <header>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/references">References</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
        <h1>Bienvenue sur la page d'accueil</h1>
        <footer>© Copyright, Tous droits réservés</footer>
    </body>
</html>
```

À noter qu'il n'est pas du tout obligatoire d'utiliser tous les blocs déclarés dans le layout principal. Un block non déclaré sera simplement ignoré :

```pug
extends frontend-layout.pug

block content
    h1 Mentions légales
    p Lorem ipsum dolor sit amet …
```
```html
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>My Layout</title>
        <link rel="stylesheet" href="https://unpkg.com/bootstrap@5.1.3/dist/css/bootstrap.min.css">
        <script src="https://polyfill.io/v3/polyfill.min.js"> </script>
    </head>
    <body>
        <header>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/references">References</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </nav>
        </header>
        <h1>Mentions légales</h1>
        <p>Lorem ipsum dolor sit amet …</p>
        <footer>© Copyright, Tous droits réservés</footer>
    </body>
</html>
```

#### Exercice

**04. Vous devez ré-organiser le HTML ci-après en utilisant un layout Pug.**

La page suivante représente la page d'accueil d'un portfolio. Créez un fichier de layout prenant en compte les éléments suivants :

- Le menu doit être placé dans un fichier `menu.pug` et inclus dans le layout avec un `include`
- Le menu s'affiche en bouclant sur l'objet suivant, lequel se trouve dans le programme Node.js :
```js
const menuItems = [
    { path: '/', title: 'Home', isActive: true },
    { path: '/about-me', title: 'About', isActive: false },
    { path: '/references', title: 'References', isActive: false },
    { path: '/contact-me', title: 'Contact', isActive: false },
];
```
- Le contenu à l'intérieur de `<main>` doit pouvoir changer d'une page à l'autre (utilisez un `block` nommé)
- Les éléments de script propre à chaque page doivent être placés à la fin du `<body>`
- Le footer se trouve dans un fichier `footer.pug`, et inclus dans le layout avec un `include`

**Modèle HTML :**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>

    <header>
        <nav>
            <ul>
                <li class="nav-active"><a href="/">Home</a></li>
                <li><a href="/about-me">About</a></li>
                <li><a href="/references">References</a></li>
                <li><a href="/contact-me">Contact</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div class="container">
            <h1>Jean DUPONT</h1>
            <p>Bienvenue sur mon portfolio</p>
            <p>Contactez-moi à l'adresse email suivante :</p>
            <output id="generate-email"></output>
        </div>
    </main>

    <script>
        // Ce script est uniquement sur cette page
        (function preventSpam() {
            const b64encodedEmail = 'amVhbi5kdXBvbnRAZ21haWwuY29t';
            document.getElementById('generate-email').textContent = atob(b64encodedEmail);
        })();
    </script>

    <footer>
        <ul>
            <li><a href="#">Mentions légales</a></li>
            <li><a href="#">CGU</a></li>
            <li><a href="#">Réclamations</a></li>
        </ul>
    </footer>

</body>
</html>
```
# Project du développement web
_pour l'UE LU3IN017 Technologies du web, L3 Informatique à Sorbonne Université, travail fait par Pornpround PARNICHTHANAKOM_

## Lancement du projet

Pour lancer l’application, suivez les étapes ci-dessous dans deux terminaux distincts :

### 1. Lancer le serveur (back-end)

Depuis le dossier `server/`, exécutez la commande suivante :
```bash
node app.js
```

### 2. Lancer le côté client (front-end)

Depuis le doisser `client/`, exécutez :
```bash
npm run dev
```

###  3. Accéder à l’application

Une fois les deux serveurs en fonctionnement, ouvrez votre navigateur à l’adresse suivante :

```bash
http://localhost:5173/
```

## Objectifs et fonctionnalités du projet

L’objectif principal de ce projet est de développer un forum, avec une architecture fullstack (MongoDB, Express, React, Node.js). Le projet inclut les fonctionnalités suivantes :
- Création de compte et connexion utilisateur
- Publication, édition et suppression de posts
- Système de commentaires
- Affichage des profils utilisateurs avec image de profil
- Barre de recherche
- Modération de contenu
- Séparation claire entre les rôles administrateur et utilisateur

## Technologies utilisées
- Front-end : React, Vite, CSS
- Back-end : Node.js. Express
- Base de données : MongoDB via Atlas
- Autres outils : Mongoose, dotenv, Mutler, Sharp

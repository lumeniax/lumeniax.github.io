# Réinitialisation des membres de la Communauté

Ce patch contient **un seul fichier** :

```
scripts/reset-community-members.mjs
```

Il vide la liste `members` de **tous les espaces** Firestore et remet
`member_count` à `0`. Il ne touche à rien d'autre :

- ✅ Les espaces sont conservés
- ✅ Les posts, commentaires et réponses sont conservés
- ✅ `post_count`, `comment_count`, `like_count` ne sont pas modifiés
- ✅ Aucun fichier source de l'app n'est changé

## Installation

1. Décompressez l'archive à la racine du projet (le fichier ira dans
   `scripts/reset-community-members.mjs`).
2. À la racine du projet, lancez :

```bash
node scripts/reset-community-members.mjs
```

Le script utilise la même config publique Firebase que l'app
(`src/firebase.ts`). Aucune clé supplémentaire n'est nécessaire tant que
vos règles Firestore actuelles autorisent les écritures côté client
(c'est le cas par défaut dans ce projet).

## Résultat

Au prochain rafraîchissement de la page Communauté, tous les espaces
afficheront **0 membre**. Les visiteurs pourront re-rejoindre normalement
ensuite — le bouton « Rejoindre » continue de fonctionner comme avant.

# Patch — création d'espace réellement fonctionnelle

  ## Fichiers à écraser dans votre projet

  - src/pages/AcademyCommunaute.tsx
  - src/hooks/useForum.ts
  - server/index.js
  - package.json
  - vite.config.ts

  ## Étapes (impératives)

  1. Décompressez le zip à la racine du projet (écrase les 5 fichiers ci-dessus).
  2. Installez la dépendance ajoutée :
         npm install
  3. Vérifiez que la variable d'environnement DATABASE_URL pointe sur une base PostgreSQL accessible.
  4. Lancez les deux serveurs avec UNE SEULE commande (cross-platform Windows / macOS / Linux) :
         npm run dev
     Vous devez voir dans le terminal :
         [api] Forum API running on http://127.0.0.1:3001
         [web] VITE v7.x ready in ... ms

  ## Ce qui a été corrigé

  - Script "dev" : remplacement de l'opérateur shell "&" (cassé sur Windows)
    par "concurrently" qui lance api + vite en parallèle, partout.
  - AcademyCommunaute.tsx :
    - Le bouton "Créer l'espace" est désormais un vrai <button type="submit">
      dans un <form>. Touche Entrée valide aussi.
    - Logs explicites dans la console : [Communauté] submitSpace appelé / POST /
      espace créé / ÉCHEC.
    - En cas d'échec POST, une alerte navigateur indique le message d'erreur
      exact (au lieu d'un échec silencieux).
    - Plus aucun blocage si le pseudo n'est pas défini (création automatique
      d'un user "Anonyme").
  - useForum.ts : identité utilisateur en mémoire + cache localStorage
    best-effort, fonctionne même si localStorage est bloqué (iframe, mode privé).
  - server/index.js : log de chaque requête API ([api] METHOD /url) pour
    diagnostic.

  ## Vérification rapide

  Ouvrez la console du navigateur (F12) puis cliquez sur "Créer un espace",
  remplissez et validez. Vous devez voir :

    [Communauté] submitSpace appelé { newName: "...", ... }
    [Communauté] POST /api/forum/spaces …
    [Communauté] espace créé: { id: "...", name: "...", ... }

  Et côté terminal :

    [api] [api] POST /api/forum/spaces

  L'espace apparaît immédiatement dans la liste.
  
# Patch — Correction "Erreur lors de la création de l'espace"

  Remplace simplement :
  - src/pages/AcademyCommunaute.tsx

  Améliorations :
  - Validation explicite : message clair si pseudo manquant ou nom vide
  - Si le pseudo n'est pas défini, ouverture automatique du dialogue pseudo
  - Création optimiste : l'espace apparaît immédiatement dans la liste
  - Effacement de l'ancienne erreur avant chaque tentative
  - Le vrai message d'erreur de l'API est affiché (au lieu d'un texte générique)
  - Plus de message bloquant "Veuillez réessayer"

  Aucun autre fichier ne change.
  
// ─────────────────────────────────────────────────────────────────────────────
// Identifiant utilisateur anonyme — persistant côté navigateur.
// Permet d'attribuer likes & commentaires sans système d'authentification.
// (Seul le userId est stocké localement, pas les articles eux-mêmes.)
// ─────────────────────────────────────────────────────────────────────────────

const KEY = "lumeniax_uid";
const NAME_KEY = "lumeniax_uname";

function genId(): string {
  return (
    "u_" +
    Math.random().toString(36).slice(2, 10) +
    Date.now().toString(36)
  );
}

export function getUserId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = genId();
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return genId();
  }
}

export function getUserName(): string {
  try {
    return localStorage.getItem(NAME_KEY) || "";
  } catch {
    return "";
  }
}

export function setUserName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name.trim().slice(0, 40));
  } catch {
    /* noop */
  }
}

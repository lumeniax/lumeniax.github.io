/**
 * Utilitaires pour la gestion des dates
 * Normalise les formats de date texte en ISO pour un tri fiable
 */

const MONTHS_FR: Record<string, number> = {
  janvier: 1, février: 2, mars: 3, avril: 4, mai: 5, juin: 6,
  juillet: 7, août: 8, septembre: 9, octobre: 10, novembre: 11, décembre: 12,
};

/**
 * Parse une date au format texte français (ex: "30 mars 2026")
 * Retourne une date ISO ou null si invalide
 */
export function parseFrenchDate(dateStr: string): string | null {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const trimmed = dateStr.trim().toLowerCase();
  if (!trimmed) return null;

  // Format: "jour mois année" (ex: "30 mars 2026")
  const parts = trimmed.split(/\s+/);
  if (parts.length < 3) return null;

  const day = parseInt(parts[0], 10);
  const monthName = parts[1];
  const year = parseInt(parts[2], 10);

  if (isNaN(day) || isNaN(year) || !MONTHS_FR[monthName]) {
    return null;
  }

  const month = MONTHS_FR[monthName];
  try {
    const date = new Date(year, month - 1, day, 12, 0, 0);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch {
    return null;
  }
}

/**
 * Normalise une date (texte français ou ISO) en ISO
 * Retourne la date ISO ou une date par défaut (maintenant)
 */
export function normalizeDate(dateStr: string | undefined): string {
  if (!dateStr) return new Date().toISOString();

  // Si déjà ISO, retourner tel quel
  if (dateStr.includes('T') && dateStr.includes('Z')) {
    return dateStr;
  }

  // Essayer de parser comme date française
  const parsed = parseFrenchDate(dateStr);
  if (parsed) return parsed;

  // Fallback : date actuelle
  return new Date().toISOString();
}

/**
 * Compare deux dates pour le tri (plus récent d'abord)
 */
export function compareDatesDesc(a: string, b: string): number {
  const dateA = new Date(a).getTime();
  const dateB = new Date(b).getTime();
  return dateB - dateA;
}

/**
 * Formate une date ISO en texte lisible français
 */
export function formatDateFr(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formatter.format(date);
  } catch {
    return '';
  }
}

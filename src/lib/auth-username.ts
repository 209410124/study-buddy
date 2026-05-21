const usernameDomain = "study-buddy.local";

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string) {
  return /^[a-z0-9_]{3,24}$/.test(normalizeUsername(value));
}

export function usernameToAuthEmail(value: string) {
  // Supabase Auth needs an email format, so the student username becomes an internal email.
  return `${normalizeUsername(value)}@${usernameDomain}`;
}

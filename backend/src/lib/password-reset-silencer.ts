// In-memory silencer for password reset email notifications.
// Marks a customer email as "silent" for a short TTL so the reset subscriber can skip emailing.

const silentMap = new Map<string, NodeJS.Timeout>()
const tokenMap = new Map<string, { token: string; timeout: NodeJS.Timeout }>()

export function setPasswordResetSilent(email: string, ttlMs = 5 * 60 * 1000) {
  clearPasswordResetSilent(email)
  const timeout = setTimeout(() => {
    silentMap.delete(email)
  }, ttlMs)
  silentMap.set(email, timeout)
}

export function isPasswordResetSilent(email: string): boolean {
  return silentMap.has(email)
}

export function clearPasswordResetSilent(email: string) {
  const t = silentMap.get(email)
  if (t) {
    clearTimeout(t)
  }
  silentMap.delete(email)
}

export function setPasswordResetToken(email: string, token: string, ttlMs = 5 * 60 * 1000) {
  clearPasswordResetToken(email)
  const timeout = setTimeout(() => {
    tokenMap.delete(email)
  }, ttlMs)
  tokenMap.set(email, { token, timeout })
}

export function getPasswordResetToken(email: string): string | undefined {
  return tokenMap.get(email)?.token
}

export function clearPasswordResetToken(email: string) {
  const rec = tokenMap.get(email)
  if (rec) {
    clearTimeout(rec.timeout)
  }
  tokenMap.delete(email)
}


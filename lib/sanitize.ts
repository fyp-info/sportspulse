// Lightweight, dependency-free input sanitization for user-supplied text.
// Defence-in-depth on top of zod validation, Prisma parameterization and
// React's auto-escaping: we strip anything that could become active markup or
// a control/injection vector before it is stored.

// Remove HTML/script tags, control characters and trim. Use for free-text
// fields (names, bios, comments, messages, post bodies).
export function sanitizeText(input: unknown): string {
  if (typeof input !== 'string') return ''
  return input
    // drop <script>…</script> blocks entirely (tag + contents)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    // strip any remaining HTML tags
    .replace(/<\/?[a-z][\s\S]*?>/gi, '')
    // neutralise stray angle brackets that survive (e.g. "a < b")
    .replace(/[<>]/g, '')
    // remove ASCII control chars (incl. null bytes) but keep tab/newline/CR
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim()
}

// Like sanitizeText but collapses to a single trimmed line. Use for short
// fields like names / usernames / subjects.
export function sanitizeLine(input: unknown): string {
  return sanitizeText(input).replace(/\s+/g, ' ').trim()
}

// Normalise an email: trim + lowercase (format is validated separately by zod).
export function sanitizeEmail(input: unknown): string {
  return typeof input === 'string' ? input.trim().toLowerCase() : ''
}

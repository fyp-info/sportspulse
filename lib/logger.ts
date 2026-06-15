// Minimal, dependency-free structured logger. Emits one JSON object per line
// (the format log collectors like Loki/Datadog/CloudWatch ingest natively) with
// a consistent shape: timestamp, level, event, and arbitrary structured fields.
//
// Used for security/auth monitoring alongside the persisted AuditLog so events
// are both queryable in the DB and visible in the process log stream.

type Level = 'info' | 'warn' | 'error'

function emit(level: Level, event: string, fields: Record<string, unknown> = {}): void {
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    level,
    event,
    ...fields,
  })
  // eslint-disable-next-line no-console
  ;(level === 'error' ? console.error : level === 'warn' ? console.warn : console.info)(line)
}

export const logger = {
  info: (event: string, fields?: Record<string, unknown>) => emit('info', event, fields),
  warn: (event: string, fields?: Record<string, unknown>) => emit('warn', event, fields),
  error: (event: string, fields?: Record<string, unknown>) => emit('error', event, fields),
}

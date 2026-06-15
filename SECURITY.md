# SportsPulse — Security

This document records the security controls in the codebase and how to run the
automated/​manual security testing that validates them.

## Implemented controls

| Area | Control | Where |
| --- | --- | --- |
| Credentials | bcrypt password hashing, work factor 10, per-user 16-byte salt | `lib/auth/server.ts` |
| Credentials | Constant-time comparison (`bcrypt.compare`) for passwords & OTPs | `lib/auth/server.ts`, `lib/auth/email-code.ts` |
| Sessions | Signed JWT (HMAC-SHA256), httpOnly/secure/sameSite cookies | `lib/auth/jwt.ts`, `lib/auth/server.ts` |
| Sessions | TTL (7d) + sliding inactivity expiry; tampered/expired tokens rejected | `lib/auth/jwt.ts`, `app/api/auth/me/route.ts` |
| Sessions | Server-side token revocation (denylist by `jti`) on logout | `lib/auth/server.ts` (`RevokedToken`), `app/api/auth/logout` |
| Access | RBAC + privilege-escalation prevention (`canManageRole`) | `lib/auth/roles.ts`, `proxy.ts`, `app/api/users` |
| Access | Permission matrix evaluated at runtime | `lib/auth/permissions.ts`, `app/api/role-permissions` |
| Brute force | Account lockout after 5 failed logins (per IP) | `app/api/auth/login/route.ts` |
| Brute force | OTP attempt limiting (5 tries) on 2FA / email-verify / reset | `lib/auth/email-code.ts` (`verifyOtp`) |
| Input | zod validation + sanitization of user-generated text | `lib/sanitize.ts`, content routes |
| Injection | Parameterized queries via Prisma ORM (no raw SQL) | `lib/prisma.ts` |
| Logging | Persisted audit log + structured (JSON) log stream | `lib/audit.ts`, `lib/logger.ts` |

## Automated testing — OWASP ZAP baseline

A passive baseline scan (spiders the app and reports common issues — missing
headers, XSS sinks, cookie flags, etc.) via the official ZAP Docker image:

```bash
# 1. Start the app
npm run build && npm start          # or: npm run dev

# 2. Run the baseline scan against it
npm run security:zap                # wraps the docker command below
```

`npm run security:zap` runs:

```bash
docker run --rm -t --add-host=host.docker.internal:host-gateway \
  -v "$PWD/security:/zap/wrk:rw" \
  ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t http://host.docker.internal:3000 \
  -r zap-report.html -I
```

The HTML report is written to `security/zap-report.html`.

## Manual testing — Burp Suite

For active auth-bypass / privilege-escalation testing:

1. Proxy the browser through Burp; log in as each role (user → superadmin).
2. **Privilege escalation:** capture a low-role request to a higher-role
   endpoint (e.g. an `editor` calling `PATCH /api/users/:id` to set `role:admin`,
   or `POST /api/role-permissions`) and confirm it returns `403`.
3. **Auth bypass:** replay requests with no cookie, an expired token, and a
   token whose payload/signature is altered — all must return `401`.
4. **Token revocation:** capture a valid session cookie, log out, then replay the
   captured cookie — it must now be rejected (denylisted `jti`).
5. **Brute force:** script 6+ wrong logins / wrong OTPs and confirm lockout
   (`429`).

Record findings and re-test after fixes.

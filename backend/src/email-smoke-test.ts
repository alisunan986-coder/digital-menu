/// <reference types="node" />

/* Standalone SMTP diagnostic for the feedback-notification path.

     npm run email:test            verify credentials + send a real test message
     npm run email:test -- --dry   verify credentials only (nothing is sent)

   It never touches Prisma, the schema or the HTTP routes, so anything that
   fails here is an SMTP problem, and anything that passes here while feedback
   mail still does not arrive points back at the API path instead.

   Env loading and credential normalisation intentionally mirror server.ts —
   in particular SMTP_PASS is de-spaced there too. Keep the two in sync.     */

import 'dotenv/config'
import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST?.trim()
const parsedPort = Number(process.env.SMTP_PORT ?? 587)
const SMTP_PORT = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 587
const SMTP_USER = process.env.SMTP_USER?.trim()
const rawSmtpPass = process.env.SMTP_PASS
/** Mirror of server.ts normalizeSmtpSecret — keep the two in sync. */
function normalizeSmtpSecret(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return trimmed
  const compact = trimmed.replace(/\s+/g, '')
  return /^[a-z0-9]{16}$/i.test(compact) ? compact : trimmed
}
const SMTP_PASS = normalizeSmtpSecret(rawSmtpPass)
const FEEDBACK_EMAIL_TO = process.env.FEEDBACK_EMAIL_TO?.trim()
const FEEDBACK_EMAIL_FROM = process.env.FEEDBACK_EMAIL_FROM?.trim() || SMTP_USER

const CONFIG: Record<string, string | undefined> = {
  SMTP_HOST,
  SMTP_USER,
  SMTP_PASS,
  FEEDBACK_EMAIL_TO,
}

/** Same actionable formatting as server.ts so both logs read identically. */
function hintFor(error: unknown): string {
  const failure = error as (NodeJS.ErrnoException & { response?: string; responseCode?: number }) | null
  const detail = failure?.response ?? failure?.message ?? String(error)

  if (failure?.responseCode === 534 || failure?.responseCode === 535) {
    return `${detail}\n   → Gmail refused AUTH. Re-check SMTP_USER, and use the 16-character App Password with the display spaces removed.`
  }
  if (failure?.code === 'ENOTFOUND' || failure?.code === 'ETIMEDOUT' || failure?.code === 'ECONNREFUSED') {
    return `${detail}\n   → Cannot reach SMTP_HOST=${SMTP_HOST ?? '(unset)'}:${SMTP_PORT} — check the host, the port and the network.`
  }
  return detail
}

async function main(): Promise<void> {
  const missing = Object.entries(CONFIG)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  // Guard on the consts themselves so the rest of this function is narrowed to
  // non-empty strings — `missing` is only there to name the offenders.
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !FEEDBACK_EMAIL_TO) {
    console.error(`❌ [email:test] missing or empty in backend/.env: ${missing.join(', ')}`)
    process.exitCode = 1
    return
  }

  const stripped = (rawSmtpPass ?? '').length - (SMTP_PASS ?? '').length
  console.log('[email:test] configuration')
  console.log(`   host    ${SMTP_HOST}:${SMTP_PORT} (${SMTP_PORT === 465 ? 'implicit TLS' : 'STARTTLS'})`)
  console.log(`   user    ${SMTP_USER}`)
  console.log(`   from    ${FEEDBACK_EMAIL_FROM}`)
  console.log(`   to      ${FEEDBACK_EMAIL_TO}`)
  console.log(
    `   pass    ${(SMTP_PASS ?? '').length} chars${stripped > 0 ? ` (${stripped} display whitespace removed from .env)` : ''}`,
  )

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    requireTLS: SMTP_PORT !== 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 30_000,
  })

  console.log('[email:test] verifying credentials…')
  try {
    await transport.verify()
    console.log('✅ [email:test] SMTP credentials accepted by the server')
  } catch (error) {
    console.error(`❌ [email:test] verify failed:\n   ${hintFor(error)}`)
    process.exitCode = 1
    return
  }

  if (process.argv.includes('--dry')) {
    console.log('ℹ️  [email:test] --dry passed — connection and auth are good, nothing was sent.')
    return
  }

  try {
    const info = await transport.sendMail({
      from: `"Taem Kitchen Feedback" <${FEEDBACK_EMAIL_FROM}>`,
      to: FEEDBACK_EMAIL_TO,
      subject: 'Test email — Taem Kitchen feedback notifications',
      text: 'This is a test message from the backend email smoke test. If you can read it, feedback notifications are working.',
      html: [
        '<div style="font-family:system-ui,sans-serif;max-width:520px;margin:auto;padding:24px;border:1px solid #e7e5e4;border-radius:12px">',
        '<h2 style="margin:0 0 12px;color:#1c1917">✅ Feedback notifications are working</h2>',
        '<p style="margin:0;color:#57534e">This is a test message from the backend email smoke test. New customer reviews will arrive in this inbox the same way.</p>',
        '</div>',
      ].join(''),
    })
    console.log(`✅ [email:test] test message accepted — ${info.messageId}`)
    console.log(`   Now check ${FEEDBACK_EMAIL_TO} (and its Spam folder).`)
  } catch (error) {
    console.error(`❌ [email:test] send failed:\n   ${hintFor(error)}`)
    process.exitCode = 1
  }
}

void main()

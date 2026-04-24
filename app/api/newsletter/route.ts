import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const stripHtml = (value: string) =>
  value
    .replace(/<[^>]*>/g, '')
    .replace(/^\d+\s*-\s*/, '')
    .trim()

const parseJsonpPayload = (raw: string) => {
  const start = raw.indexOf('(')
  const end = raw.lastIndexOf(')')
  if (start === -1 || end === -1 || end <= start + 1) {
    return null
  }
  const json = raw.slice(start + 1, end)
  try {
    return JSON.parse(json) as { result?: string; msg?: string }
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string
      emailFieldName?: string
      hiddenFieldName?: string
      action?: string
    }
    const email = (body.email || '').trim()
    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const endpoint = (body.action || process.env.MAILCHIMP_SUBSCRIBE_ENDPOINT || '').trim()
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Newsletter endpoint is not configured.' },
        { status: 500 }
      )
    }

    const normalizedEndpoint = endpoint.includes('/post-json')
      ? endpoint
      : endpoint.replace(/\/post(\?|$)/, '/post-json$1')
    const emailFieldName = (body.emailFieldName || 'EMAIL').trim()
    const hiddenFieldName = (body.hiddenFieldName || process.env.MAILCHIMP_B_FIELD || '').trim()

    const url = new URL(normalizedEndpoint)
    url.searchParams.set(emailFieldName, email)
    if (hiddenFieldName) {
      url.searchParams.set(hiddenFieldName, '')
    }
    url.searchParams.set('c', 'mailchimpCallback')

    const mailchimpResponse = await fetch(url.toString(), { cache: 'no-store' })
    const responseText = await mailchimpResponse.text()
    const payload = parseJsonpPayload(responseText)

    if (!payload) {
      return NextResponse.json(
        { error: 'Could not parse newsletter provider response.' },
        { status: 502 }
      )
    }

    if (payload.result !== 'success') {
      return NextResponse.json(
        { error: stripHtml(payload.msg || 'Subscription failed. Please try again.') },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Thanks! Please check your inbox to confirm your subscription.',
    })
  } catch {
    return NextResponse.json({ error: 'Could not submit right now. Please try again.' }, { status: 500 })
  }
}

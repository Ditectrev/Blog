'use client'

import { FormEvent, useState } from 'react'

type NewsletterFormProps = {
  title?: string
  action?: string
  emailFieldName?: string
  hiddenFieldName?: string
}

export default function NewsletterForm({
  title = 'Subscribe to the newsletter',
  action = '',
  emailFieldName = 'EMAIL',
  hiddenFieldName = '',
}: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState<'idle' | 'success' | 'error'>('idle')
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    setStatusType('idle')
    setStatusMessage('')
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          emailFieldName,
          hiddenFieldName,
          action,
        }),
      })
      const data = (await response.json()) as { error?: string; message?: string }
      if (!response.ok) {
        setStatusType('error')
        setStatusMessage(data.error || 'Subscription failed. Please try again.')
        return
      }
      setStatusType('success')
      setStatusMessage(data.message || 'Thanks! Please check your inbox to confirm your subscription.')
      setEmail('')
    } catch {
      setStatusType('error')
      setStatusMessage('Could not submit right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <h3 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name={emailFieldName}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="ring-primary-500 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 transition outline-none placeholder:text-gray-400 focus:ring-2 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-500 rounded-md px-4 py-2 font-medium text-white transition focus:ring-2 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-900"
        >
          {isSubmitting ? 'Submitting...' : 'Sign up'}
        </button>
      </form>
      {statusType !== 'idle' ? (
        <p
          className={`mt-3 text-sm ${
            statusType === 'success'
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}
        >
          {statusMessage}
        </p>
      ) : null}
    </div>
  )
}

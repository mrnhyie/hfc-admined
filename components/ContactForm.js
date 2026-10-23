'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { submitMessage } from '@/app/actions/messages';

const EMPTY = { ok: false, errors: {}, values: {} };

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitMessage, EMPTY);
  const values = state.values || {};
  const errors = state.errors || {};

  if (state.ok) {
    return (
      <div className="notice" role="status">
        <p>Your message reached the church team. We will get back to you soon.</p>
        <Link className="link-inline" href="/contact">
          Send another message
        </Link>
      </div>
    );
  }

  return (
    <form className="contact-form" action={action}>
      <div className="field">
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={values.name || ''}
          placeholder="Kofi Abban"
          aria-invalid={errors.name ? 'true' : undefined}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name ? (
          <div className="form-error" id="name-error">
            {errors.name}
          </div>
        ) : null}
      </div>
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={values.email || ''}
          placeholder="kofi@example.com"
          aria-invalid={errors.email ? 'true' : undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email ? (
          <div className="form-error" id="email-error">
            {errors.email}
          </div>
        ) : null}
      </div>
      <div className="field">
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" defaultValue={values.phone || ''} placeholder="+233 ..." />
      </div>
      <div className="field">
        <label htmlFor="body">Message</label>
        <textarea
          id="body"
          name="body"
          required
          defaultValue={values.body || ''}
          placeholder="How can we help?"
          aria-invalid={errors.body ? 'true' : undefined}
          aria-describedby={errors.body ? 'body-error' : undefined}
        />
        {errors.body ? (
          <div className="form-error" id="body-error">
            {errors.body}
          </div>
        ) : null}
      </div>
      <button className="btn btn-pill btn-pill-gold" type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}

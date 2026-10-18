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
        <input id="name" name="name" type="text" required defaultValue={values.name || ''} placeholder="Kofi Abban" />
        {errors.name ? <div className="form-error">{errors.name}</div> : null}
      </div>
      <div className="field">
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" required defaultValue={values.email || ''} placeholder="kofi@example.com" />
        {errors.email ? <div className="form-error">{errors.email}</div> : null}
      </div>
      <div className="field">
        <label htmlFor="phone">Phone (optional)</label>
        <input id="phone" name="phone" type="tel" defaultValue={values.phone || ''} placeholder="+233 ..." />
      </div>
      <div className="field">
        <label htmlFor="body">Message</label>
        <textarea id="body" name="body" required defaultValue={values.body || ''} placeholder="How can we help?" />
        {errors.body ? <div className="form-error">{errors.body}</div> : null}
      </div>
      <button className="btn btn-plum" type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}

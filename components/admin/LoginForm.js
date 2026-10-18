'use client';

import { useActionState } from 'react';
import { signIn } from '@/app/admin/actions';

export default function LoginForm({ churchName }) {
  const [state, action, isPending] = useActionState(signIn, { errors: {} });

  return (
    <div>
      <form className="login-box" action={action}>
        <div className="admin-kicker">{churchName}</div>
        <h1>Sign in to manage the site</h1>

        {state?.errors?.form ? <p className="form-error">{state.errors.form}</p> : null}

        <p className="field">
          <label className="label" htmlFor="email">
            Email
          </label>
          <input className="input" id="email" name="email" type="email" autoComplete="username" required />
        </p>
        <p className="field">
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            className="input"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </p>

        <button className="btn-admin" type="submit" disabled={isPending}>
          {isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="login-foot">
        Visitors do not need an account. <a href="/">Go to the public site</a>
      </p>
    </div>
  );
}

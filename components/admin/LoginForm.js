'use client';

import { useActionState } from 'react';
import { signIn } from '@/app/admin/actions';

export default function LoginForm({ churchName }) {
  const [state, action, isPending] = useActionState(signIn, { errors: {} });

  return (
    <form className="login-box" action={action}>
      <span className="login-kicker">{churchName}</span>
      <h1>Login</h1>
      <p className="login-sub">Enter your email and password to manage the church site.</p>

      {state?.errors?.form ? <p className="form-error">{state.errors.form}</p> : null}

      <p className="field">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          className="input"
          id="email"
          name="email"
          type="email"
          placeholder="you@email.com"
          autoComplete="username"
          required
        />
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

      <button className="btn-admin login-submit" type="submit" disabled={isPending}>
        {isPending ? 'Signing in...' : 'Login'}
      </button>

      <p className="login-foot">
        Church staff only. <a href="/">Go to the public site</a>
      </p>
    </form>
  );
}

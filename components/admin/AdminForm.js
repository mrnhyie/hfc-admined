'use client';

import { useActionState } from 'react';

export default function AdminForm({ action, children, aside, sideTitle = 'Publishing', submitLabel = 'Save', extra }) {
  const [state, formAction, isPending] = useActionState(action, { errors: {} });
  const errors = Object.values(state?.errors || {});

  return (
    <form className="editor-grid" action={formAction}>
      <div className="editor-main">
        {errors.length ? <p className="form-error">{errors.join(' ')}</p> : null}
        {children}
      </div>

      <aside className="editor-side">
        <span className="label">{sideTitle}</span>
        {state?.saved ? <span className="pill pill-saved">Saved</span> : null}
        {aside}
        <div className="editor-actions">
          <button className="btn-admin" type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : submitLabel}
          </button>
          {extra}
        </div>
      </aside>
    </form>
  );
}

'use client';

export default function DeleteForm({ action, id, label = 'Delete', message = 'Delete this item? This cannot be undone.' }) {
  return (
    <form
      action={action}
      method="post"
      onSubmit={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="btn-admin btn-danger" type="submit">
        {label}
      </button>
    </form>
  );
}

export function Field({ label, name, value = '', type = 'text', required, placeholder, maxLength, hint }) {
  return (
    <p className="field">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <input
        className="input"
        id={name}
        name={name}
        type={type}
        defaultValue={value ?? ''}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {hint ? <span className="hint">{hint}</span> : null}
    </p>
  );
}

export function TextArea({ label, name, value = '', placeholder, hint, short }) {
  return (
    <p className="field">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <textarea
        className={`textarea${short ? ' textarea-short' : ''}`}
        id={name}
        name={name}
        defaultValue={value ?? ''}
        placeholder={placeholder}
      />
      {hint ? <span className="hint">{hint}</span> : null}
    </p>
  );
}

export function Select({ label, name, value, options }) {
  return (
    <p className="field">
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <select className="select" id={name} name={name} defaultValue={value ?? options[0][0]}>
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </p>
  );
}

export function Check({ label, name, value, hint }) {
  return (
    <p className="check">
      <input id={name} name={name} type="checkbox" defaultChecked={Boolean(value)} />
      <label className="check-label" htmlFor={name}>
        {label}
      </label>
      {hint ? <span className="hint">{hint}</span> : null}
    </p>
  );
}

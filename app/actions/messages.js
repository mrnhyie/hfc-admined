'use server';

import { createMessage } from '@/lib/queries';
import { parseMessageForm } from '@/lib/forms';

export async function submitMessage(_state, formData) {
  const parsed = parseMessageForm(formData);
  if (!parsed.ok) {
    return { ok: false, errors: parsed.errors, values: Object.fromEntries(formData.entries()) };
  }

  await createMessage(parsed.values);
  return { ok: true, errors: {}, values: {} };
}

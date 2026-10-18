'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSession, destroySession, getSessionUser } from '@/lib/auth';
import {
  parseEventForm,
  parseMediaForm,
  parsePostForm,
  parseProgramForm,
  parseSettingsForm,
} from '@/lib/forms';
import {
  eventsCrud,
  getAdminByEmail,
  mediaCrud,
  postsCrud,
  programsCrud,
  setMessageStatus,
  setSettings,
} from '@/lib/queries';
import { uniqueSlug } from '@/lib/slugs';

async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');
  return user;
}

function revalidateSite() {
  revalidatePath('/', 'layout');
}

function toId(formData) {
  const raw = String(formData.get('id') ?? '');
  const id = Number.parseInt(raw, 10);
  if (!Number.isFinite(id)) throw new Error('Missing record id.');
  return id;
}

export async function signIn(_state, formData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const admin = await getAdminByEmail(email);

  const valid = admin && (await bcrypt.compare(password, admin.password_hash));
  if (!valid) {
    return { errors: { form: 'Email or password is not correct.' } };
  }

  await createSession(admin);
  redirect('/admin');
}

export async function signOut() {
  await requireAdmin();
  await destroySession();
  redirect('/admin/login');
}

export async function saveEvent(state, formData) {
  await requireAdmin();
  const parsed = parseEventForm(formData);
  if (!parsed.ok) return { errors: parsed.errors };

  const { values } = parsed;
  const id = formData.get('id');
  const slug = await uniqueSlug('events', values.slug, { ignoreId: id ? Number(id) : undefined });
  const payload = { ...values, slug };

  if (id) {
    await eventsCrud.update(Number(id), payload);
  } else {
    await eventsCrud.create(payload);
  }

  revalidateSite();
  redirect('/admin/events');
}

export async function deleteEvent(formData) {
  await requireAdmin();
  await eventsCrud.remove(toId(formData));
  revalidateSite();
  redirect('/admin/events');
}

export async function saveProgram(state, formData) {
  await requireAdmin();
  const parsed = parseProgramForm(formData);
  if (!parsed.ok) return { errors: parsed.errors };

  const { values } = parsed;
  const id = formData.get('id');
  const slug = await uniqueSlug('programs', values.slug, { ignoreId: id ? Number(id) : undefined });
  const payload = { ...values, slug, meeting_day: values.meeting_day || null, meeting_time: values.meeting_time || null };

  if (id) {
    await programsCrud.update(Number(id), payload);
  } else {
    await programsCrud.create(payload);
  }

  revalidateSite();
  redirect('/admin/programs');
}

export async function deleteProgram(formData) {
  await requireAdmin();
  await programsCrud.remove(toId(formData));
  revalidateSite();
  redirect('/admin/programs');
}

export async function savePost(state, formData) {
  await requireAdmin();
  const parsed = parsePostForm(formData);
  if (!parsed.ok) return { errors: parsed.errors };

  const { values } = parsed;
  const id = formData.get('id');
  const slug = await uniqueSlug('posts', values.slug, { ignoreId: id ? Number(id) : undefined });
  const payload = { ...values, slug };

  if (id) {
    await postsCrud.update(Number(id), payload);
  } else {
    await postsCrud.create(payload);
  }

  revalidateSite();
  redirect('/admin/content');
}

export async function deletePost(formData) {
  await requireAdmin();
  await postsCrud.remove(toId(formData));
  revalidateSite();
  redirect('/admin/content');
}

export async function saveMedia(state, formData) {
  await requireAdmin();
  const parsed = parseMediaForm(formData);
  if (!parsed.ok) return { errors: parsed.errors };

  const id = formData.get('id');
  if (id) {
    await mediaCrud.update(Number(id), parsed.values);
  } else {
    await mediaCrud.create(parsed.values);
  }

  revalidateSite();
  redirect('/admin/media');
}

export async function deleteMedia(formData) {
  await requireAdmin();
  await mediaCrud.remove(toId(formData));
  revalidateSite();
  redirect('/admin/media');
}

export async function saveSettings(state, formData) {
  await requireAdmin();
  const values = parseSettingsForm(formData);
  if (!Object.keys(values).length) return { errors: { form: 'Nothing to save.' } };

  await setSettings(values);
  revalidateSite();
  return { errors: {}, saved: true };
}

export async function markMessage(formData) {
  await requireAdmin();
  const id = toId(formData);
  const status = String(formData.get('status') ?? 'read');
  await setMessageStatus(id, ['new', 'read', 'archived'].includes(status) ? status : 'read');
  revalidateSite();
  redirect('/admin/messages');
}

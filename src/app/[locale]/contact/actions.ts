'use server';

import { Resend } from 'resend';
import { z } from 'zod';
import { site } from '@/config/site';

export type ContactField = 'name' | 'company' | 'email' | 'phone' | 'message';
export type FieldError = 'required' | 'email' | 'tooLong';
export type ContactValues = Partial<Record<ContactField, string>>;

export type ContactState = {
  status: 'idle' | 'success' | 'error' | 'invalid';
  fieldErrors?: Partial<Record<ContactField, FieldError>>;
  /** Echoed back so the form keeps the visitor's input after a failed send. */
  values?: ContactValues;
};

const schema = z.object({
  name: z.string().trim().min(1, 'required').max(120, 'tooLong'),
  company: z.string().trim().max(160, 'tooLong'),
  email: z.string().trim().min(1, 'required').max(254, 'tooLong').pipe(z.email('email')),
  phone: z.string().trim().max(40, 'tooLong'),
  message: z.string().trim().min(1, 'required').max(5000, 'tooLong'),
});

const FIELDS: ContactField[] = ['name', 'company', 'email', 'phone', 'message'];

export async function submitInquiry(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = Object.fromEntries(
    FIELDS.map((f) => [f, String(formData.get(f) ?? '')]),
  ) as Record<ContactField, string>;

  // Honeypot: bots fill every field. Pretend success, send nothing.
  if (String(formData.get('website') ?? '').length > 0) {
    return { status: 'success' };
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: ContactState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= (['required', 'email', 'tooLong'].includes(issue.message)
        ? issue.message
        : 'required') as FieldError;
    }
    return { status: 'invalid', fieldErrors, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Mail is not configured yet (brief §6.3): fail softly and let the UI show
    // the public email address instead of throwing a 500.
    console.warn('[contact] RESEND_API_KEY is not set; inquiry was not sent.');
    return { status: 'error', values };
  }

  const { name, company, email, phone, message } = parsed.data;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || `HYRON Website <website@hyroninternational.com>`,
      to: process.env.CONTACT_TO_EMAIL || site.email,
      replyTo: email,
      subject: `Website inquiry — ${name}${company ? ` (${company})` : ''}`,
      text: [
        `Name: ${name}`,
        `Company: ${company || '—'}`,
        `Email: ${email}`,
        `Phone: ${phone || '—'}`,
        '',
        message,
      ].join('\n'),
    });
    if (error) {
      console.error('[contact] Resend error', error);
      return { status: 'error', values };
    }
    return { status: 'success' };
  } catch (err) {
    console.error('[contact] send failed', err);
    return { status: 'error', values };
  }
}

import { z } from 'zod';

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

/**
 * Runs in the browser: Web3Forms rejects server-side submissions on the free
 * plan ("Use our API in client side … Pro plan is required"), so this is a
 * client action for useActionState rather than a Server Action. The access key
 * is public by design; it only lets a form deliver to the inbox it was
 * created for.
 */
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

  // Inlined at build time: redeploy after setting it in Vercel.
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    // Mail is not configured yet (brief §6.3): fail softly and let the UI show
    // the public email address instead.
    console.warn('[contact] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set; inquiry was not sent.');
    return { status: 'error', values };
  }

  const { name, company, email, phone, message } = parsed.data;
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Website inquiry — ${name}${company ? ` (${company})` : ''}`,
        from_name: 'HYRON Website',
        // Web3Forms sets Reply-To from `email`.
        name,
        email,
        company: company || '—',
        phone: phone || '—',
        message,
      }),
    });
    const body = (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
    if (!res.ok || !body?.success) {
      console.error('[contact] Web3Forms error', res.status, body?.message);
      return { status: 'error', values };
    }
    return { status: 'success' };
  } catch (err) {
    console.error('[contact] send failed', err);
    return { status: 'error', values };
  }
}

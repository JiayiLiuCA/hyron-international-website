'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useRef } from 'react';
import {
  submitInquiry,
  type ContactField,
  type ContactState,
} from '@/app/[locale]/contact/actions';
import { cn } from '@/lib/cn';
import { ArrowIcon } from './ui';

const initial: ContactState = { status: 'idle' };

export function ContactForm({ email }: { email: string }) {
  const t = useTranslations('Contact.form');
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const statusRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === 'invalid') {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    } else if (state.status !== 'idle') {
      statusRef.current?.focus();
    }
  }, [state]);

  const errorFor = (field: ContactField) => {
    const code = state.fieldErrors?.[field];
    if (!code) return undefined;
    if (code === 'tooLong') return t('errors.tooLong');
    if (field === 'email') return t('errors.email');
    return t(`errors.${field as 'name' | 'message'}`);
  };

  // Remount fields after each response so defaultValue picks up echoed input.
  const formKey = JSON.stringify(state.values ?? {});

  return (
    <form ref={formRef} action={action} noValidate className="relative">
      <div key={formKey} className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        <Field name="name" label={t('name')} required autoComplete="name" state={state} error={errorFor('name')} />
        <Field name="company" label={t('company')} autoComplete="organization" state={state} error={errorFor('company')} optionalLabel={t('optional')} />
        <Field name="email" type="email" label={t('email')} required autoComplete="email" state={state} error={errorFor('email')} />
        <Field name="phone" type="tel" label={t('phone')} autoComplete="tel" state={state} error={errorFor('phone')} optionalLabel={t('optional')} />
        <Field name="message" label={t('message')} required multiline state={state} error={errorFor('message')} className="sm:col-span-2" />
      </div>

      {/* Honeypot — hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          {t('honeypot')}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div
        ref={statusRef}
        tabIndex={-1}
        role={state.status === 'error' || state.status === 'invalid' ? 'alert' : 'status'}
        aria-live="polite"
        className="outline-none"
      >
        {state.status === 'success' ? (
          <p className="mt-8 border-l-2 border-gold bg-ivory px-5 py-4 text-[0.9375rem] text-royal">
            {t('success')}
          </p>
        ) : null}
        {state.status === 'error' ? (
          <p className="mt-8 border-l-2 border-[#a3322a] bg-[#fbf0ee] px-5 py-4 text-[0.9375rem] text-[#7a231d]">
            {t.rich('error', {
              email,
              link: (chunks) => (
                <a href={`mailto:${email}`} className="font-semibold underline underline-offset-4">
                  {chunks}
                </a>
              ),
            })}
          </p>
        ) : null}
        {state.status === 'invalid' ? (
          <p className="mt-8 text-[0.9375rem] text-[#7a231d]">{t('invalid')}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="group mt-8 inline-flex min-h-13 w-full items-center justify-center gap-4 bg-royal px-8 py-4 text-[0.8125rem] font-semibold tracking-[0.14em] text-ivory uppercase transition-colors duration-300 hover:bg-royal-700 disabled:cursor-wait disabled:opacity-70 sm:w-auto lang-zh:text-base lang-zh:tracking-[0.08em]"
      >
        {pending ? t('submitting') : t('submit')}
        <ArrowIcon className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5" />
      </button>

      <p className="mt-8 max-w-xl border-t border-royal/12 pt-6 text-sm leading-relaxed text-ink/75">
        {t('notice')}
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
  multiline,
  autoComplete,
  state,
  error,
  optionalLabel,
  className,
}: {
  name: ContactField;
  label: string;
  type?: string;
  required?: boolean;
  multiline?: boolean;
  autoComplete?: string;
  state: ContactState;
  error?: string;
  optionalLabel?: string;
  className?: string;
}) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    required,
    autoComplete,
    defaultValue: state.values?.[name] ?? '',
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: cn(
      'mt-2.5 block w-full border bg-white px-4 py-3.5 text-base text-ink transition-colors duration-300 placeholder:text-ink/40 focus:border-royal focus:outline-none focus-visible:outline-none focus:ring-1 focus:ring-royal',
      error ? 'border-[#a3322a]' : 'border-royal/20 hover:border-royal/40',
    ),
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-4 text-sm font-semibold text-royal">
        {label}
        {required ? null : <span className="text-xs font-normal text-ink/70">{optionalLabel}</span>}
      </label>
      {multiline ? (
        <textarea {...shared} rows={6} className={cn(shared.className, 'resize-y')} />
      ) : (
        <input {...shared} type={type} />
      )}
      {error ? (
        <p id={errorId} className="mt-2 text-sm text-[#7a231d]">
          {error}
        </p>
      ) : null}
    </div>
  );
}

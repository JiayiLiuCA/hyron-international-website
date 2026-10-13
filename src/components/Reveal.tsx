'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/*
 * Scroll reveal for photo wipes and gold rules. The hidden starting state
 * lives in globals.css (`[data-reveal]:not(.is-revealed)`, only when scripting
 * is on and motion is allowed). `.is-revealed` is React state set after this
 * component has hydrated — never a DOM mutation from outside React, which
 * caused hydration mismatches in segments that hydrate later than the layout.
 */

const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

function observe(el: Element, onEnter: () => void) {
  if (!('IntersectionObserver' in window)) {
    onEnter();
    return () => {};
  }
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.1 },
  );
  callbacks.set(el, onEnter);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

export function Reveal({
  as: Tag = 'div',
  kind,
  className,
  style,
  children,
}: {
  as?: 'div' | 'span';
  kind: 'line' | 'image';
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el, () => setRevealed(true));
  }, []);

  return (
    <Tag
      // Both tags accept an HTMLElement ref at runtime.
      ref={ref as React.RefObject<HTMLDivElement & HTMLSpanElement>}
      aria-hidden={kind === 'line' ? true : undefined}
      data-reveal={kind}
      style={style}
      className={cn(className, revealed && 'is-revealed')}
    >
      {children}
    </Tag>
  );
}

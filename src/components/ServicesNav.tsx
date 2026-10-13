'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Sticky in-page index for /services. Highlights the section currently in
 * view and keeps the active item scrolled into view on narrow screens.
 */
export function ServicesNav({
  label,
  items,
}: {
  label: string;
  items: { id: string; number: string; title: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = items
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // A thin band ~35% down the viewport decides which section is "current".
      { rootMargin: '-35% 0px -64% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [items]);

  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-nav-item="${active}"]`);
    if (!list || !el || list.scrollWidth <= list.clientWidth) return;
    // Scroll the strip only — never the page.
    list.scrollTo({ left: el.offsetLeft - (list.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);

  return (
    <nav
      aria-label={label}
      className="sticky top-16 z-30 border-y border-royal/12 bg-paper/94 backdrop-blur-md lg:top-20"
    >
      <ul ref={listRef} className="container-page relative flex gap-2 overflow-x-auto [scrollbar-width:none] lg:justify-between">
        {items.map((item) => (
          <li key={item.id} className="shrink-0">
            <a
              href={`#${item.id}`}
              data-nav-item={item.id}
              aria-current={active === item.id ? 'location' : undefined}
              className={cn(
                'relative flex items-baseline gap-3 px-3 py-4 text-[0.9375rem] font-semibold whitespace-nowrap text-royal/70 transition-colors duration-300 hover:text-royal lg:px-0 lg:text-base',
                'aria-[current=location]:text-royal',
              )}
            >
              <span className="font-serif text-sm text-gold-700">{item.number}</span>
              {item.title}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-x-3 -bottom-px h-0.5 origin-left bg-gold transition-transform duration-500 ease-out-expo lg:inset-x-0',
                  active === item.id ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

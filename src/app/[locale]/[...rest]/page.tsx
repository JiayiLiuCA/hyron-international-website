import { notFound } from 'next/navigation';

// This segment only ever throws notFound(), so Cache Components' dev-time
// instant-navigation validation cannot render it ("Could not validate
// `instant`…"). Opt it out; a 404 has no reason to navigate instantly.
export const instant = false;

// Unknown paths under a valid locale render the localized not-found page
// inside the site layout.
export default function CatchAll() {
  notFound();
}

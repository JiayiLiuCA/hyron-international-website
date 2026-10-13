import { Open_Sans, Trirong } from 'next/font/google';

// Trirong 600 stands in for the paid Collier SemiBold headline face (brief §3.2);
// 400 is used for large serif lead paragraphs. If the client licenses Collier,
// swap this for next/font/local.
export const trirong = Trirong({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-trirong',
});

export const openSans = Open_Sans({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
});

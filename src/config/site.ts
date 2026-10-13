/**
 * Company facts. Every value marked TODO(client) is a default pending client
 * confirmation (see brief/BRIEF.md §2 and §8). Copy in messages/*.json must
 * reference these via ICU variables instead of hard-coding them.
 */
export const site = {
  name: 'HYRON',
  nameZh: '海润国际',
  // TODO(client): legal entity name for the copyright line.
  legalName: 'HYRON',
  copyrightYear: 2026,
  url: 'https://www.hyroninternational.com',

  // TODO(client): brochure says 905-597-8585; business card lists a personal mobile.
  phone: {
    display: '1 (888) 688-8518',
    href: 'tel:+18886888518',
    e164: '+1-888-688-8518',
  },

  // TODO(client): confirm public mailbox. Never use the brochure gmail addresses.
  email: 'info@hyroninternational.com',

  // TODO(client): confirm the address is current and may be published.
  address: {
    street: '50 Minthorn Blvd, Suite 102',
    locality: 'Thornhill',
    region: 'ON',
    postalCode: 'L3T 7X8',
    country: 'CA',
    lines: ['50 Minthorn Blvd, Suite 102', 'Thornhill, ON L3T 7X8', 'Canada'],
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=50+Minthorn+Blvd+Suite+102+Thornhill+ON+L3T+7X8',
  },

  // TODO(client): confirm hours.
  hours: {
    en: 'Monday–Friday, 10 am – 6 pm',
    zh: '周一至周五，上午 10 点至下午 6 点',
    schema: 'Mo-Fr 10:00-18:00',
  },
} as const;

export type Site = typeof site;

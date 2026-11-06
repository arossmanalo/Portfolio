// Main quests. Only facts confirmed by Aryl or visible on GitHub.
// TODO(confirm): Laundry POS and A Ross Trading details.
export const projects = [
  {
    id: 'eakma',
    title: 'eAkma',
    tag: 'Hackathon · Top 30 · ₱100,000 prize',
    summary:
      'A mobile-first student funding navigator built for the eGov PH Hackathon 2026. It matches a student profile against a dated catalogue of funding programmes, explains the evidence behind each result, and links to the official agency. Matching is deterministic; the AI only explains.',
    role: 'Team project',
    stack: ['Next.js', 'TypeScript', 'Drizzle', 'Turso', 'Playwright'],
    links: [
      { label: 'Live demo', href: 'https://egov-eakma.vercel.app' },
      { label: 'Repo', href: 'https://github.com/bayie27/egov-eakma' },
    ],
  },
  {
    id: 'alalay',
    title: 'AlalayByahe',
    tag: 'AppBuilders PH Hackathon 2026',
    summary:
      'An offline-first commute assistant for the Philippines. It reads a trip typed in Filipino, English or Taglish with a small on-device model, then plans the journey from stored, source-checked data. The model never invents routes or fares.',
    role: 'Hackathon project',
    stack: ['React Native', 'Expo', 'TypeScript', 'llama.rn', 'SQLite'],
    links: [{ label: 'Repo', href: 'https://github.com/arossmanalo/AlalayByahe' }],
  },
  {
    id: 'laundry',
    title: 'Laundry POS',
    tag: 'In daily use · 2 branches',
    summary:
      'A point-of-sale application for our laundry shop. It is a working system used across two branches, and it taught me the most about building for real people with real deadlines.',
    role: 'Developer',
    stack: ['Java'],
    links: [{ label: 'Repo', href: 'https://github.com/arossmanalo/Laundry-Pos' }],
  },
  {
    id: 'aross',
    title: 'A Ross Trading',
    tag: 'Inventory & form generator',
    summary:
      'An inventory and form generator built for A Ross Trading and Services, to keep stock records and paperwork in one place.',
    role: 'Developer',
    stack: ['TypeScript'],
    links: [
      {
        label: 'Repo',
        href: 'https://github.com/arossmanalo/A-Ross-Trading-and-Services-Inventory-and-Form-Generator',
      },
    ],
  },
  {
    id: 'cloudsent',
    title: 'CloudSent',
    tag: 'JPCS DLSL',
    summary:
      'A digital prayer wall with a moderated admin dashboard and a school display that drifts approved prayers across the screen, with a QR code so anyone can add one.',
    role: 'JPCS project',
    stack: ['React', 'TypeScript', 'Supabase', 'Vercel'],
    links: [
      { label: 'Live demo', href: 'https://cloudsent.vercel.app' },
      { label: 'Repo', href: 'https://github.com/dlsl-jpcs/cloudsent' },
    ],
  },
];

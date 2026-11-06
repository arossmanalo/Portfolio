// Inventory slots. "usedIn" is taken from the repos on GitHub, not guessed.
// TODO(confirm): languages spoken, and any tools/certs Aryl wants listed.
export const inventory = [
  {
    id: 'stack',
    label: 'Tech stack',
    items: [
      { abbr: 'TS', name: 'TypeScript', note: 'My most-used language across recent projects.', usedIn: ['eAkma', 'AlalayByahe', 'CloudSent', 'A Ross Trading', 'indesia'] },
      { abbr: 'Re', name: 'React', note: 'Interfaces for web apps and dashboards.', usedIn: ['CloudSent', 'This portfolio'] },
      { abbr: 'Nx', name: 'Next.js', note: 'Full-stack web framework.', usedIn: ['eAkma'] },
      { abbr: 'RN', name: 'React Native + Expo', note: 'Android apps that work offline.', usedIn: ['AlalayByahe'] },
      { abbr: 'No', name: 'Node.js', note: 'APIs and tooling.', usedIn: ['eAkma', 'CloudSent'] },
      { abbr: 'Ja', name: 'Java', note: 'Where I learned OOP and data structures, and built a real POS.', usedIn: ['Laundry POS', 'OOP Enrollment System', 'DataStruc-Finals'] },
      { abbr: 'C#', name: 'C#', note: 'Used for a school app development project.', usedIn: ['appdev-finals'] },
      { abbr: 'Sb', name: 'Supabase', note: 'Hosted Postgres database.', usedIn: ['CloudSent'] },
      { abbr: 'Dz', name: 'Drizzle + Turso', note: 'Typed database access on SQLite/libSQL.', usedIn: ['eAkma'] },
      { abbr: 'SQ', name: 'SQLite', note: 'On-device storage for offline use.', usedIn: ['AlalayByahe'] },
      { abbr: 'Ph', name: 'Phaser + Preact', note: 'Browser game rendering and UI.', usedIn: ['indesia'] },
      { abbr: 'Vt', name: 'Vitest + Playwright', note: 'Unit and end-to-end tests.', usedIn: ['eAkma', 'indesia'] },
      { abbr: 'Ve', name: 'Vercel', note: 'Hosting and serverless functions.', usedIn: ['eAkma', 'CloudSent'] },
      { abbr: 'Gt', name: 'Git + GitHub', note: 'Version control and teamwork.', usedIn: ['Every project'] },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    items: [
      { abbr: 'FS', name: 'Full-stack web apps', note: 'From the database to the interface, end to end.', usedIn: ['eAkma', 'CloudSent', 'A Ross Trading'] },
      { abbr: 'OF', name: 'Offline-first mobile', note: 'Apps that keep working without a connection.', usedIn: ['AlalayByahe'] },
      { abbr: 'AI', name: 'On-device AI', note: 'Running a small language model on the phone, with checks so it never makes up facts.', usedIn: ['AlalayByahe'] },
      { abbr: 'RU', name: 'Building for real users', note: 'Software people depend on every day.', usedIn: ['Laundry POS'] },
      { abbr: 'GD', name: 'Game development', note: 'Deterministic game logic, maps, towers and enemies.', usedIn: ['indesia'] },
      { abbr: 'QA', name: 'Automated testing', note: 'Tests that catch problems before users do.', usedIn: ['eAkma', 'indesia'] },
      { abbr: 'HK', name: 'Hackathons', note: 'Shipping a working prototype against the clock.', usedIn: ['eGov PH Hackathon 2026', 'AppBuilders PH Hackathon 2026'] },
      { abbr: 'PM', name: 'Project management', note: 'Still growing. It is the direction I am heading.', usedIn: ['Goal'] },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    items: [
      { abbr: 'ED', name: 'BSIT, System Development', note: '3rd year at De La Salle Lipa.', usedIn: ['Education'] },
      { abbr: 'JP', name: 'JPCS DLSL Chapter', note: 'Member of the ITEQS team.', usedIn: ['Organisation'] },
      { abbr: 'FL', name: 'Filipino & English', note: 'I build for both, including Taglish.', usedIn: ['Languages'] },
      { abbr: 'MU', name: 'Music', note: 'What I have on while I code.', usedIn: ['Off duty'] },
      { abbr: 'GM', name: 'Gaming', note: 'It is also why I build games.', usedIn: ['Off duty'] },
      { abbr: 'FT', name: 'Sports & fitness', note: 'How I reset between projects.', usedIn: ['Off duty'] },
    ],
  },
];

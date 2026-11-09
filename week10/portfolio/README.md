# Midnight Observatory

A personal portfolio built with Next.js, TypeScript, and Tailwind CSS. Its
midnight sky, daybreak theme, interactive skill map, and illustrated portrait
make the site feel like an observatory rather than a template.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/data/` — profile, project, skill, certification, timeline, and console data.
- `src/components/portfolio.tsx` — interactive portfolio sections and navigation.
- `src/app/resume/` — printable resume page; choose “Print / Save as PDF” to export.
- `public/images/portrait-observatory-soft.png` — softly stylized version of the supplied portrait.

The portrait was processed on-device with macOS Core Image filters. The original
photo is not included in this project and was not sent to an external service.

Project details are drawn from the existing course repository. The certifications
list is intentionally empty until verified certificate details are supplied.
Edit the data files in `src/data/` to add or update profile information. Skill
project links are derived from `usedIn` project IDs in `src/data/skills.ts`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy

This Next.js app is ready to deploy as a separate project on Vercel. Import this
folder as the project root and use the standard Next.js build settings.

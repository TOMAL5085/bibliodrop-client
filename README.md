# BiblioDrop Client

Next.js frontend for the BiblioDrop book delivery platform.

## What It Does

- Shows a polished home page with featured books and provider highlights
- Supports browsing, filtering, sorting, and paginating books
- Includes book details, auth screens, and role-based dashboards
- Uses responsive layouts, loading states, and error/404 handling

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

## Notes

- The current UI uses local mock data so it works without a backend connection.
- The app now exposes its own API routes under `src/app/api`, so it can run on Vercel without a separate Express backend.
- Leave `NEXT_PUBLIC_API_BASE_URL` empty unless you intentionally deploy a separate backend elsewhere.

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
- The Express API scaffold lives in `bibliodrop-server`.
- Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000` to let the public pages read from the API first and fall back to local data when needed.

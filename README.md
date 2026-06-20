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

- Deploy this as the client Vercel project.
- Set `NEXT_PUBLIC_BASE_URL` to the client URL and `NEXT_PUBLIC_API_BASE_URL` to the server URL.
- Google sign-in, MongoDB auth, and image uploads now live on the `bibliodrop-server` project.
- The server project owns `MONGODB_URI`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `IMGBB_API_KEY`.

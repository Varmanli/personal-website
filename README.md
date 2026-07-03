# Varmanli.ir

Full-stack personal commercial portfolio built with Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL, and Drizzle ORM.

## Development

```bash
npm install
npm run db:migrate
npm run dev
```

Required environment variables live in [.env.example](/C:/Users/amirhosein/Desktop/Project/multi-project-deploy/varmanli.ir/.env.example).

## Persistent Uploads

Admin-uploaded branding and media assets are stored outside `public/` in a configurable upload directory and served through `/uploads/...`.

- `UPLOAD_DIR` controls where files are written on disk.
- `NEXT_PUBLIC_UPLOAD_BASE_URL` controls the public URL prefix for those files.
- Default local values are `./uploads` and `/uploads`.

Production requirement:

- Mount `UPLOAD_DIR` as a persistent volume. Example for Docker/Coolify: mount `/app/uploads`.
- Do not point uploads at `.next`, `tmp`, or any path replaced during deploys.

Files are served by the app through `GET /uploads/[...path]`, with path traversal protection and cache headers.

## Production

Build and run:

```bash
npm run build
npm run start
```

If you deploy with the included [Dockerfile](/C:/Users/amirhosein/Desktop/Project/multi-project-deploy/varmanli.ir/Dockerfile), also:

1. Set runtime env vars such as `DATABASE_URL`, `AUTH_SECRET`, `UPLOAD_DIR`, and `NEXT_PUBLIC_UPLOAD_BASE_URL`.
2. Mount a persistent volume to `/app/uploads`.

## Notes

- Existing absolute asset URLs remain valid.
- Legacy stored paths like `/uploads/...` and `/public/uploads/...` are normalized on read for backward compatibility.

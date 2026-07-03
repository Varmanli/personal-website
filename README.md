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

## Production Bootstrap

Production startup can initialize the database automatically without running a
manual shell command inside the container.

- `npm run db:bootstrap` runs the production-safe bootstrap directly.
- `npm run start` runs bootstrap first, then starts Next.js.
- `RUN_DB_BOOTSTRAP_ON_START=true` enables startup bootstrap. This is the default in the Docker image.
- `RUN_DB_BOOTSTRAP_AT_BUILD=true` is optional and should only be used when the build environment can safely reach the target database.

Bootstrap behavior:

- Applies Drizzle SQL migrations from `db/migrations`
- Ensures the initial `site_settings` row exists
- Does not run demo/dev seed data
- Does not overwrite existing settings, users, projects, services, or content

## Production

Build and run:

```bash
npm run build
npm run start
```

If you deploy with the included [Dockerfile](/C:/Users/amirhosein/Desktop/Project/multi-project-deploy/varmanli.ir/Dockerfile), also:

1. Set runtime env vars such as `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `RUN_DB_BOOTSTRAP_ON_START`, `UPLOAD_DIR`, and `NEXT_PUBLIC_UPLOAD_BASE_URL`.
2. Mount a persistent volume to `/app/uploads`.
3. Leave `RUN_DB_BOOTSTRAP_AT_BUILD=false` unless your build worker can reach the production database.

## Notes

- Existing absolute asset URLs remain valid.
- Legacy stored paths like `/uploads/...` and `/public/uploads/...` are normalized on read for backward compatibility.

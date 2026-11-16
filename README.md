This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Run Next.js and Convex with Docker

This Compose setup runs a self-hosted Convex backend and the Next.js development server. Compose Watch syncs source edits into the Next.js container; the Convex CLI runs there too and watches/deploys changes under `convex/`.

1. Start Convex and generate a local admin key:

   ```bash
   docker compose up -d convex
   docker compose exec convex ./generate_admin_key.sh
   ```

2. Copy `.env.example` to `.env` and put the generated key in `CONVEX_SELF_HOSTED_ADMIN_KEY`.

3. Start the app and Compose Watch:

   ```bash
   docker compose up --watch
   ```

Open [http://localhost:3000](http://localhost:3000) for Next.js and [http://localhost:6791](http://localhost:6791) for the Convex dashboard. Sign in to the dashboard with the admin key generated in step 1. Convex is available at `http://localhost:3210` and its HTTP actions at `http://localhost:3211`. Compose Watch requires Docker Compose 2.22 or newer. The default Convex instance secret is for local development only.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

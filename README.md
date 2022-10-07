# Fixed Asset System - `FAS`

Built with [T3 Stack](https://create.t3.gg/) for our development team and have the greatest developer experience using typescript, next, tailwind, and prisma.

## Information about `FAS`

- `FAS` is a fixed asset system that is used to manage fixed assets in a company.

# Development Decisions

## Why `t3-stack`?

T3 Stack showed a lot of promising boilerplate for every modern technology stack. It's a great starting point for our project. Scaling this project will be a lot easier because of typescript.

Using `t3-stack` will give you the following benefits:

- [Next-Auth.js](https://next-auth.js.org) for server side and client side authentication
- [Prisma](https://prisma.io) type-safety ORM for database
- [TailwindCSS](https://tailwindcss.com) for modern styling and better experience developing UIs
- [tRPC](https://trpc.io) type-safe API layer

## Getting started

### Install dependencies

```bash
  npm install # or
  yarn # or
  pnpm install
```

### Add environment variables

```bash
  #.env

  DATABASE_URL=<postgres database>

  NEXTAUTH_SECRET=<secret>
  NEXTAUTH_URL=http://localhost:3000 # or your domain

  DISCORD_CLIENT_ID=<discord client id> # optional
  DISCORD_CLIENT_SECRET=<discord secret> # optional

  NEXT_PUBLIC_CLIENT_EMAIL=@omsim.com # custom email
```

### Run the development server

```bash
  npm run dev # or
  yarn dev # or
  pnpm dev
```

You can now view the app at http://localhost:3000.

## Depoloyment

### Vercel

We recommend deploying to [Vercel](https://vercel.com/?utm_source=t3-oss&utm_campaign=oss). It makes it super easy to deploy NextJs apps.

- Push your code to a GitHub repository.
- Go to [Vercel](https://vercel.com/?utm_source=t3-oss&utm_campaign=oss) and sign up with GitHub.
- Create a Project and import the repository you pushed your code to.
- Add your environment variables.
- Click **Deploy**
- Now whenever you push a change to your repository, Vercel will automatically redeploy your website!

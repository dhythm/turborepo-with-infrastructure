# Turborepo with Infrastructure

This repository is intended to catch up the architecture about Turborepo with infrastructure.

## Creating a repo

Run the following command:

```sh
npx create-turbo@latest

? Where would you like to create your Turborepo? turborepo-with-infrastructure
? Which package manager do you want to use? pnpm

>>> Creating a new Turborepo with:

Application packages
 - apps/docs
 - apps/web
Library packages
 - packages/eslint-config
 - packages/typescript-config
 - packages/ui

>>> Success! Created your Turborepo at turborepo-with-infrastructure

To get started:
- Change to the directory: cd turborepo-with-infrastructure
- Enable Remote Caching (recommended): pnpm dlx turbo login
   - Learn more: https://turborepo.com/remote-cache

- Run commands with Turborepo:
   - pnpm run build: Build all apps and packages
   - pnpm run dev: Develop all apps and packages
   - pnpm run lint: Lint all apps and packages
- Run a command twice to hit cache
```

## Setting up the environment



### Build

To build all apps and packages, run the following command:

```
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
pnpm dev
```

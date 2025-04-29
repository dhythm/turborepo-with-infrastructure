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

## Preparing tools

Run the following command to install tools:

```sh
npm install -g cdktf-cli
brew install terraform
```

```sh
gcloud auth application-default login
gcloud config get-value project
```

## Setting up the environment

1. Create a new package:

```sh
mkdir packages/infra
cd packages/infra
```

2. Initialize CDKTF project:

```sh
cdktf init --template=typescript --local --project-name="infra" --providers="google@~>4.0"

? Project Description A simple getting started project for cdktf.
? Do you want to start from an existing Terraform project? no
? Do you want to send crash reports to the CDKTF team? Refer to 
https://developer.hashicorp.com/terraform/cdktf/create-and-deploy/configuration-file#enable-crash-reporting-for-the-cli for more information yes
```

3. Synthesize Terraform files:

```sh
pnpm run --filter=infra synth
```

4. Deploy resources:

```sh
pnpm run --filter=infra deploy
```
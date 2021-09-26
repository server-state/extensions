# Server State Core Extensions

This repository contains all Server State extensions that are officially maintained by the Server State team itself (i.e., all npm packages that follow the `@server-state/*-extension` pattern).

## Monorepo management

This repository uses a custom, lightweight monorepo management system (instead of, e.g., `lerna` and similar tools), based on npm workspaces.

You'll therefore need to have `npm >= v7.14` installed on your system.

### Conventional commits

Changelogs get generated based on [conventional commit messages](https://www.conventionalcommits.org/en/v1.0.0/) using the [`standard-version`](https://github.com/conventional-changelog/standard-version) CLI tool.

### Setting up the dev environment

Run `npm ci`.

### Adding a dependency to a specific package

Run `npm i [dependency-name] -w ./packages/[package-name]`

### Adding a global devDependency

In the repo root folder, run `npm i -D [dependency-name]`

> yes, it's as easy as that.

### Creating a new release

In the root repo folder, run `npm run release`

### Publishing the packages

Run `npm run publish-all`. This temporarily replaces all `file:*` references of cross-dependencies with the current version numbers.

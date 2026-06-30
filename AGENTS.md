# Repository Guidelines

## Project Structure & Module Organization

This is an Astro personal blog. `src/pages/` defines routes such as the home
page, post pages, RSS, robots, and tag pages. Reusable UI lives in
`src/components/`, layout shells in `src/layouts/`, styles in `src/styles/`,
client scripts in `src/scripts/`, shared helpers in `src/utils/`, and i18n
strings in `src/i18n/`. Content collections are under `src/content/posts/` and
`src/content/pages/`; their frontmatter schemas are defined in
`src/content.config.ts`. Static files belong in `public/`, while imported
images and icons live in `src/assets/`.

## Build, Test, and Development Commands

Use pnpm 10 via `npx --yes pnpm@10 ...`; Node must be `>=22.12.0`.

- `npx --yes pnpm@10 install --frozen-lockfile`: install exact dependencies.
- `npx --yes pnpm@10 run dev`: start the Astro dev server.
- `npx --yes pnpm@10 run build`: run `astro check`, build `dist/`, generate
  Pagefind search, and copy search assets.
- `npx --yes pnpm@10 run preview`: preview the built site locally.
- `npx --yes pnpm@10 run lint`: run ESLint.
- `npx --yes pnpm@10 run format:check`: verify Prettier formatting.

## Coding Style & Naming Conventions

Use TypeScript, Astro components, and ESM imports. Prettier enforces 2-space
indentation, semicolons, double quotes, trailing commas where valid, and
80-column wrapping. ESLint applies Astro recommendations and forbids `console`.
Name Astro components in PascalCase, such as `Header.astro`, and utilities in
camelCase, such as `getSortedPosts.ts`. Keep route filenames aligned with Astro
conventions.

## Testing Guidelines

There is no dedicated unit test suite. Treat `pnpm run lint`,
`pnpm run format:check`, and `pnpm run build` as the required validation path.
For content changes, run the dev server and check affected pages, tags, RSS, and
search behavior when relevant.

## Commit & Pull Request Guidelines

Recent history uses short, imperative subjects such as `Update dependencies` and
`Remove archives page`; follow that style and keep subjects specific. Pull
requests should describe the change, list validation commands run, link related
issues when available, and include screenshots for visible UI or content layout
changes. Note any generated output changes, especially `public/pagefind/`.

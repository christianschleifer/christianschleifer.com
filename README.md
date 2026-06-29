# christianschleifer.com

Personal blog of Christian Schleifer, built with Astro and based on the AstroPaper theme.

The site is deployed to AWS Amplify at:

```text
https://christianschleifer.com
```

## Stack

- Astro
- TypeScript
- Tailwind CSS
- Pagefind for static search
- Satori and Sharp for generated Open Graph images
- pnpm for package management

## Content

Blog posts live in:

```text
src/content/posts/
```

Static content pages live in:

```text
src/content/pages/
```

Site-specific configuration lives in:

```text
astro-paper.config.ts
```

## Development

Install dependencies:

```bash
npx --yes pnpm@10 install --frozen-lockfile
```

Start the local dev server:

```bash
npx --yes pnpm@10 run dev
```

Run linting:

```bash
npx --yes pnpm@10 run lint
```

Build the production site:

```bash
npx --yes pnpm@10 run build
```

The build script runs Astro type checks, builds the static site, creates the Pagefind search index, and copies the search assets into `public/pagefind/`.

## Deployment

Deployment is configured in:

```text
amplify.yml
```

The Amplify build uses Node 24 via `nvm` and installs with pnpm:

```yaml
preBuild:
  commands:
    - nvm install 24
    - nvm use 24
    - npx --yes pnpm@10 install --frozen-lockfile
build:
  commands:
    - npx --yes pnpm@10 run build
artifacts:
  baseDirectory: dist
```

## Updating From Upstream

This repository tracks the upstream AstroPaper template through the `template` git remote:

```bash
git remote -v
```

To update this site to the latest upstream AstroPaper version, ask Codex from the repository root:

```text
pull in the latest from https://github.com/satnaing/astro-paper
```

Codex should:

1. Fetch `template/main`.
2. Merge it into the local `main` branch.
3. Resolve conflicts by keeping this site's content and configuration.
4. Preserve local choices documented here, including no `.github`, `.husky`, `.jampack`, `.vscode`, Docker setup, or archives page.
5. Keep dependencies in `package.json` as major-version ranges such as `6.x`.
6. Verify with:

```bash
npx --yes pnpm@10 install --frozen-lockfile
npx --yes pnpm@10 run lint
npx --yes pnpm@10 run build
```

Review the diff before committing the result.

## Notes

- Generated output in `dist/`, `.astro/`, and `public/pagefind/` is ignored.
- The project intentionally does not keep the upstream AstroPaper demo content, GitHub templates, Docker setup, Husky setup, or VS Code settings.
- Dependency ranges in `package.json` are major-version ranges such as `6.x` and `4.x`.

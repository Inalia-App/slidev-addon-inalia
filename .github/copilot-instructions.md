# Slidev Addon Inalia
Slidev Addon Inalia is the official addon for [Inalia](https://inalia.app) to make Slidev presentations interactive. This is a TypeScript Vue.js library that extends Slidev with real-time interactive features, charts, audience questions, and live reactions.

## Slidev Documentation
- For Slidev framework questions, syntax, layouts, components, addon APIs, or CLI behavior, consult `https://sli.dev/llms.txt` before using broader web search.
- Use `https://sli.dev/llms.txt` as an index to find the most relevant official Slidev page, then read only the linked sections needed for the task.
- Prefer the official Slidev docs over assumptions when changing Slidev-specific behavior, but follow this repository's instructions when they are more specific.

## Vitest Documentation
- For testing questions, syntax, test runner behavior, or mocking techniques, consult `https://vitest.dev/llms.txt` before using broader web search.
- Use `https://vitest.dev/llms.txt` as an index to find the most relevant official Vitest page, then read only the linked sections needed for the task.
- Prefer the official Vitest docs over assumptions when writing tests, but follow this repository's instructions when they are more specific.

## Working Effectively

### Environment Setup
- Node.js LTS
- pnpm latest version

### Bootstrap and Dependencies
- Install dependencies: `pnpm install`

### Build Process
- Addon build: `pnpm run prepack`
- Presentation build: `pnpm run build`

### Testing and Quality
- Lint code: `pnpm run lint`
- Run tests: `pnpm run test`
- Auto-fix linting: `pnpm run lint:fix`. Prefer this over manual fixes to ensure consistency with the project's ESLint configuration.

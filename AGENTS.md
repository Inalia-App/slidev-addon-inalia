# Project

- `slidev-addon-inalia` is the Slidev addon for [Inalia](https://inalia.app), with runtime integration and a Vite plugin.
- `slidev-addon-inalia` and `inalia` are separate packages, not aliases. This package owns the Slidev runtime integration and Vite plugin; `inalia` owns the CLI for using and setting up the addon.

Never touch the README unless the user explicitly requests it.

## Documentation

- The CLI and addon documentation lives in [Inalia-App/inalia.app](https://github.com/Inalia-App/inalia.app), under `apps/inalia.app/content/knowledge-base/`.
- Keep documentation accurate, not exhaustive. A user-facing change does not automatically require a documentation change.
- Document only what users need to understand a concept or accomplish a task. Skip self-explanatory UI behavior, cosmetic changes, and implementation details.
- When updating an article, make the smallest useful change. Do not expand it with related details, edge cases, or troubleshooting unless necessary for the task.
- Describe the current product, not change history, legacy behavior, or backward compatibility unless explicitly requested.
- Add an article only for a distinct user need not already covered; maintain the index when adding, renaming, or removing articles.
- When a documentation update is needed, include it in the same task. If it requires a separate pull request in `inalia.app`, link that pull request.

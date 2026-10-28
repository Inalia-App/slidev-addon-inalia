# Project

- `slidev-addon-inalia` is the Slidev addon for [Inalia](https://inalia.app), with runtime integration and a Vite plugin.
- `slidev-addon-inalia` and `inalia` are separate packages, not aliases. This package owns the Slidev runtime integration and Vite plugin; `inalia` owns the CLI for using and setting up the addon.

Never touch the README unless the user explicitly requests it.

## Documentation

- Keep the CLI and addon documentation in [Inalia-App/inalia.app](https://github.com/Inalia-App/inalia.app) up to date whenever changing this repository.
- For changes that affect installation, configuration, authentication, components, or other user-facing behavior, update the corresponding documentation in `inalia.app` as part of the same task.
- If no documentation update is needed, explain why in the pull request. If the documentation changes require a separate pull request in `inalia.app`, link it in this repository's pull request.

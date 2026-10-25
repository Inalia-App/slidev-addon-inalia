# slidev-addon-inalia

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Slidev Addon Inalia is the official addon for [Inalia](https://inalia.app) to make Slidev presentations interactive.

## Official Documentation

Documentation for Slidev Addon Inalia can be found on the [official documentation](https://docs.inalia.app/slidev-addon-inalia).

## Choose a talk from the CLI

Inside your Slidev project, run (Node.js 20.12+):

```sh
npx slidev-addon-inalia select-talk
```

The command lists all talks for your account, shows their titles and numbers, and saves your selection as `VITE_INALIA_TALK_NUMBER` in `.env`. It reuses `VITE_INALIA_USERNAME` and `VITE_INALIA_API_KEY` from your environment or project `.env`, prompting for missing credentials. Use a dedicated token with **read** permission from [Tokens](https://inalia.app/profile/tokens).

Unrelated `.env` entries and comments are preserved. Cancelling, an empty list, or a failed request leaves the file unchanged. Restart Slidev after selecting a talk. This command does not install the add-on or change `slides.md`; use `npx slidev-addon-inalia` for initial setup.

For self-hosted Inalia, set `VITE_INALIA_ENDPOINT` to your server origin. The server must support `GET /api/{username}/talks` (read permission, verified account with access, owner only).

Keep `.env` gitignored. The current add-on exposes its token in browser-side code: do not publicly host a live-configured deck, and revoke dedicated tokens after use.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

_This project follows the recommended practices of Slidev for [addons development](https://sli.dev/guide/write-addon)._

## License

Published under the [MIT](./LICENSE) license.

[npm-version-src]: https://img.shields.io/npm/v/slidev-addon-inalia?style=flat&colorA=18181B&colorB=ad46ff
[npm-version-href]: https://npmjs.com/package/slidev-addon-inalia
[npm-downloads-src]: https://img.shields.io/npm/dm/slidev-addon-inalia?style=flat&colorA=18181B&colorB=ad46ff
[npm-downloads-href]: https://npmjs.com/package/slidev-addon-inalia

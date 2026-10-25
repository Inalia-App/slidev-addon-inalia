# slidev-addon-inalia

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Slidev Addon Inalia is the official addon for [Inalia](https://inalia.app) to make Slidev presentations interactive.

## Live configuration

Run `npx slidev-addon-inalia` in your Slidev project, or configure:

```dotenv
VITE_INALIA_API_KEY=YOUR_DEDICATED_TOKEN
VITE_INALIA_TALK_NUMBER=YOUR_TALK_NUMBER
```

The addon resolves your username from the token via `GET /api/me`. Your backend must support this endpoint before updating the addon.

Use a dedicated token with **read** permission (also **write** to run talks from the deck). Without the token or talk number, the addon stays in static mode. Tokens are exposed in browser-delivered JavaScript: do not publicly host a live-configured deck.

## Official Documentation

Documentation for Slidev Addon Inalia can be found on the [official documentation](https://docs.inalia.app/slidev-addon-inalia).

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

_This project follows the recommended practices of Slidev for [addons development](https://sli.dev/guide/write-addon)._

## License

Published under the [MIT](./LICENSE) license.

[npm-version-src]: https://img.shields.io/npm/v/slidev-addon-inalia?style=flat&colorA=18181B&colorB=ad46ff
[npm-version-href]: https://npmjs.com/package/slidev-addon-inalia
[npm-downloads-src]: https://img.shields.io/npm/dm/slidev-addon-inalia?style=flat&colorA=18181B&colorB=ad46ff
[npm-downloads-href]: https://npmjs.com/package/slidev-addon-inalia

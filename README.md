# slidev-addon-inalia

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

Slidev Addon Inalia is the official addon for [Inalia](https://inalia.app) to make Slidev presentations interactive.

## Official Documentation

Documentation for Slidev Addon Inalia can be found on the [official documentation](https://docs.inalia.app/slidev-addon-inalia).

## API tokens and publishing

`VITE_` variables are embedded in browser JavaScript. An API token used by a live
presentation is visible to anyone who can access that presentation, including
people on the same network when the development server is exposed. Never use a
broadly privileged account token for public presentations.

Production builds disable Inalia authentication by
default, even when your local `.env` or `~/.inaliarc` contains a token. Live
features are disabled; supply static question content to retain question results.
Development presentations continue to use your configured credentials.

If you deliberately need a live deployed presentation, set
`VITE_INALIA_ALLOW_PUBLIC_TOKEN=true` when building. **This publishes your token
to every visitor.** Use a narrowly scoped, short-lived token where supported and
revoke it after the event. This option is not a security boundary or a substitute
for server-side authorization.

Do not commit `.env` files. If you previously deployed slides with a token,
remove the old artifacts and revoke/rotate the token; rebuilding cannot undo
an earlier disclosure.

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

_This project follows the recommended practices of Slidev for [addons development](https://sli.dev/guide/write-addon)._

## License

Published under the [MIT](./LICENSE) license.

[npm-version-src]: https://img.shields.io/npm/v/slidev-addon-inalia?style=flat&colorA=18181B&colorB=ad46ff
[npm-version-href]: https://npmjs.com/package/slidev-addon-inalia
[npm-downloads-src]: https://img.shields.io/npm/dm/slidev-addon-inalia?style=flat&colorA=18181B&colorB=ad46ff
[npm-downloads-href]: https://npmjs.com/package/slidev-addon-inalia

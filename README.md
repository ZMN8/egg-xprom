# egg-xprom

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-xprom.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-xprom
[download-image]: https://img.shields.io/npm/dm/egg-xprom.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-xprom

<!--
Description here.
promethues egg plugin
collect request,curl monitor message
-->

## Install

```bash
$ npm i egg-xprom --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.xprom = {
  enable: true,
  package: 'egg-xprom',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.xprom = {
  port:3000 // default 3000
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)

# egg-xprom

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-xprom.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-xprom
[travis-image]: https://img.shields.io/travis/EcarxCloudPlatform/egg-xprom.svg?style=flat-square
[travis-url]: https://travis-ci.org/EcarxCloudPlatform/egg-xprom
[codecov-image]: https://img.shields.io/codecov/c/github/EcarxCloudPlatform/egg-xprom.svg?style=flat-square
[codecov-url]: https://codecov.io/github/EcarxCloudPlatform/egg-xprom?branch=master
[david-image]: https://img.shields.io/david/EcarxCloudPlatform/egg-xprom.svg?style=flat-square
[david-url]: https://david-dm.org/EcarxCloudPlatform/egg-xprom
[snyk-image]: https://snyk.io/test/npm/egg-xprom/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-xprom
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

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
  port:9999, // default 9999 ;Docker need EXPOSE 9999
  name:'xprom-test' // default project name
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Other

plugin will upload curl request monitor data.

if url is <http://baidu.com>,monitor targetServer is **baidu.com**;

if url is <http://message-platform:10000>,monitor targetServer is **message-platform**;

if url is <http://api.xc22hanger.ccn/device-platform/ecarx_ca22r/msisdn/2>,monitor targetServer is **api.xc22hanger.ccn**

if you want your custom targetServer,you can add field ***promServerName***

example:
```js
await this.app.curl('http://baidu.com', { method: 'GET', promServerName: 'myCustomName' });
```

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)





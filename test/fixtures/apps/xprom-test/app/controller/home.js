'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.app.curl('http://baidu.com');
    await this.app.curl('http:yhjkkk/timeout', { timeout: 1000 });
    this.ctx.body = 'hi, ' + this.app.plugins.xprom.name;
  }
  async timeout() {
    await new Promise(r => setTimeout(() => {
      r(1);
    }, 10000));
  }
}

module.exports = HomeController;

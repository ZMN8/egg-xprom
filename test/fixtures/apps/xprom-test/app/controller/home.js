'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    await this.app.curl('http://baidu.com');
    try {
      await this.app.curl('http://yhjkkk/timeout', { timeout: 1000, promServerName: 'someOne' });
    } catch (error) {
      console.log(error);
    }
    try {
      await this.app.curl('http://100.97.236.16:10072/api/count/oncall', { timeout: 1000 });
    } catch (error) {
      console.log(error);
    }
    try {
      await this.app.curl('http://geel22y.healthlinkiot.com:8080/HealthLink/TspGeeaWork', { timeout: 1000 });
    } catch (error) {
      console.log(error);
    }
    try {
      await this.app.curl('http://api.xc22hanger.ccn/device-platform/ecarx_ca22r/msisdn/2?target=model,color,config,owner,tbox,ihu,volume,mat,commonConfig', { timeout: 1000 });
    } catch (error) {
      console.log(error);
    }
    this.ctx.body = 'hi, ' + this.app.plugins.xprom.name;
  }
  async timeout() {
    await new Promise(r => setTimeout(() => {
      r(1);
    }, 10000));
  }
}

module.exports = HomeController;

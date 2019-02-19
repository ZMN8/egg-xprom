'use strict';

module.exports = app => {

  const CURL = Symbol('curl');
  app[CURL] = app.curl;
  app.curl = async function (...args) {
    const path = args[0],
      startTs = Date.now();
    let method = 'GET';
    if (args[1] && args[1].method) method = args[1].method;
    let promServerName;
    if (args[1] && args[1].promServerName) promServerName = args[1].promServerName;
    try {
      const result = await app[CURL](...args);
      const status = result.res.statusCode;
      const consume = (Date.now() - startTs) / 1000;
      app.messenger.sendToAgent('promethus-event', {
        type: 'http_request_other',
        data: { path, method, status, consume, promServerName },
      });
      return result;
    } catch (error) {
      const consume = (Date.now() - startTs) / 1000;
      app.messenger.sendToAgent('promethus-event', {
        type: 'http_request_other',
        data: { path, method, consume, status: 500, promServerName },
      });
      throw error;
    }
  };

  app.on('response', ctx => {
    const { method, status } = ctx;
    const path = ctx.routerPath || 'notmatch';
    const consume = (Date.now() - ctx.starttime) / 1000;
    const filterList = ['/favicon.ico', '/robots.txt'];

    if (!filterList.includes(path)) {
      app.messenger.sendToAgent('promethus-event', {
        type: 'http_request',
        data: { path, method, status, consume },
      });
    }

  });

  // 确保 sequelize 实例已存在
  if (app.model){
    const LOG = Symbol('log')
    app.Sequelize[LOG] = app.Sequelize.prototype.log;
    // 重写 Sequelize.prototype.log 函数
    app.Sequelize.prototype.log = function () {
      app.Sequelize[LOG].apply(app.model, arguments)
      const args = Array.prototype.slice.call(arguments);
      const { tableNames, model, type } = args[2];
      if (tableNames) {
        const duration = isNaN(args[1]) ? args[1] : args[1]/1000;// 毫秒转化成秒
        app.messenger.sendToAgent('promethus-event', {
          type: 'database',
          data: { table: model.name, type, duration },
        });
      }
    }
  }

};

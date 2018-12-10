'use strict';

module.exports = app => {

  const CURL = Symbol('curl');
  app[CURL] = app.curl;
  app.curl = async function(...args) {
    const path = args[0],
      startTs = Date.now();
    let method = 'GET';
    if (args[1] && args[1].method) method = args[1].method;
    try {
      const result = await app[CURL](...args);
      const status = result.res.statusCode;
      const consume = (Date.now() - startTs) / 1000;
      app.messenger.sendToAgent('promethus-event', {
        type: 'http_request_other_success',
        data: { path, method, status, consume },
      });
      return result;
    } catch (error) {
      const consume = (Date.now() - startTs) / 1000;
      app.messenger.sendToAgent('promethus-event', {
        type: 'http_request_other_fail',
        data: { path, method, consume, status: -1 },
      });
      throw error;
    }
  };

  app.on('response', ctx => {
    const { method, path, status } = ctx;
    const consume = (Date.now() - ctx.starttime) / 1000;
    const filterList = [ '/favicon.ico', '/robots.txt' ];

    if (!filterList.includes(path)) {
      app.messenger.sendToAgent('promethus-event', {
        type: 'http_request',
        data: { path, method, status, consume },
      });
    }

  });
};

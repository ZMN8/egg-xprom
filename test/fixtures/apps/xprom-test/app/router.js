'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.get('/index', controller.home.index);
  router.get('/timeout', controller.home.timeout);
};

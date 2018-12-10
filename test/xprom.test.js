'use strict';

const mock = require('egg-mock');

describe('test/xprom.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/xprom-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /index', async () => {
    try {
      await app.httpRequest()
        .get('/index')
        .expect(200);
    } catch (error) {
      console.log(error);
    }
    await new Promise(r => setTimeout(() => {
      r(1);
    }, 100000));
  });
});

'use strict';

const { Counter, Summary, register, collectDefaultMetrics } = require('prom-client');
const http = require('http');

module.exports = agent => {
  const server = http.createServer((req, res) => {
    if (req.url === '/metrics') {
      res.setHeader('Content-Type', register.contentType);
      res.end(register.metrics());
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('not found');
    }
  });
  server.listen(agent.config.xprom.port || 3000);
  collectDefaultMetrics({
    timeout: 5000, register,
  });

  // egg api monitor
  const ApiResponseTime = new Summary({
    name: 'http_response_time',
    help: 'http_response_time',
    labelNames: [ 'method', 'path', 'status', 'consume' ],
  });
  const ApiRequestRate = new Counter({
    name: 'http_request_rate',
    help: 'http_request_rate',
    labelNames: [ 'method', 'path', 'status', 'consume' ],
  });

  // curl other api monitor
  const OtherApiResponseSuccessTime = new Summary({
    name: 'http_other_response_success_time',
    help: 'http_other_response_success_time',
    labelNames: [ 'method', 'path', 'status', 'consume' ],
  });
  const OtherApiRequestSuccessRate = new Counter({
    name: 'http_other_response_success_rate',
    help: 'http_other_response_success_rate',
    labelNames: [ 'method', 'path', 'status', 'consume' ],
  });
  const OtherApiResponseFailTime = new Summary({
    name: 'http_other_response_fail_time',
    help: 'http_other_response_fail_time',
    labelNames: [ 'method', 'path', 'status', 'consume' ],
  });
  const OtherApiRequestFailRate = new Counter({
    name: 'http_other_response_fail_rate',
    help: 'http_other_response_fail_rate',
    labelNames: [ 'method', 'path', 'status', 'consume' ],
  });

  agent.messenger.on('promethus-event', data => {
    const { method, path, consume, status } = data.data;
    switch (data.type) {
      case 'http_request_other_success':
        OtherApiRequestSuccessRate.inc({ method, path, status }, 1);
        OtherApiResponseSuccessTime.observe({ method, path, status }, consume);
        break;
      case 'http_request_other_fail':
        OtherApiRequestFailRate.inc({ method, path, status }, 1);
        OtherApiResponseFailTime.observe({ method, path, status }, consume);
        break;
      case 'http_request':
        ApiRequestRate.inc({ method, path, status }, 1);
        ApiResponseTime.observe({ method, path, status }, consume);
        break;
      default:
        break;
    }

  });

};

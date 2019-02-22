'use strict';

const { Counter, Gauge, Histogram, register } = require('prom-client');
const http = require('http');

module.exports = agent => {
  try {
    const httpServer = http.createServer((req, res) => {
      if (req.url === '/ops/monitor') {
        res.setHeader('Content-Type', register.contentType);
        res.end(register.metrics());
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
      }
    });
    httpServer.listen(agent.config.xprom.port || 9999);
    const server = agent.config.xprom.name || agent.config.name;
    const database = agent.config.sequelize ?  agent.config.sequelize.database : null;

    // 接口总访问量（次数）
    const http_request_total = new Counter({
      name: 'http_request_total',
      help: 'http_request_total',
      labelNames: [ 'server', 'method', 'handler' ],
    });
    // 接口响应请求时长(秒)
    const http_request_duration_seconds = new Gauge({
      name: 'http_request_duration_seconds',
      help: 'http_request_duration_seconds',
      labelNames: [ 'server', 'method', 'handler' ],
    });
    // 接口响应时间统计
    const http_request_duration_histogram = new Histogram({
      name: 'http_request_duration_histogram',
      help: 'http_request_duration_histogram',
      labelNames: [ 'server', 'method', 'handler' ],
      buckets: [ 0.1, 0.5, 1, 5 ],
    });
    // 接口响应值分布值
    const http_request_code_histogram = new Histogram({
      name: 'http_request_code_histogram',
      help: 'http_request_code_histogram',
      labelNames: [ 'server', 'method', 'handler' ],
      buckets: [ 200, 300, 400, 500 ],
    });
    // 调用依赖服务响应时长(秒)
    const http_depend_service_reponses_seconds = new Gauge({
      name: 'http_depend_service_reponses_seconds',
      help: 'http_depend_service_reponses_seconds',
      labelNames: [ 'server', 'target', 'method' ],
    });
    // 调用依赖服务的响应时间统计
    const http_depend_service_reponses_histogram = new Histogram({
      name: 'http_depend_service_reponses_histogram',
      help: 'http_depend_service_reponses_histogram',
      labelNames: [ 'server', 'target', 'method' ],
      buckets: [ 0.1, 0.5, 1, 5 ],
    });
    // 调用依赖服务响应状态统计
    const http_depend_service_status_histogram = new Histogram({
      name: 'http_depend_service_status_histogram',
      help: 'http_depend_service_status_histogram',
      labelNames: [ 'server', 'target', 'method' ],
      buckets: [ 200, 300, 400, 500 ],
    });
    /************ database ****************/
    // 服务调用sql情况汇总（次数）
    const service_database_exec_total = new Counter({
      name: 'service_database_exec_total',
      help: 'service_database_exec_total',
      labelNames: ['server', 'database', 'type'],
    });

    // 服务调用sql时长(秒)
    const service_database_exec_duration_seconds = new Gauge({
      name: 'service_database_exec_duration_seconds',
      help: 'service_database_exec_duration_seconds',
      labelNames: ['server', 'database', 'table', 'type'],
    });

    // 服务执行sql所用时间统计
    const service_database_duration_histogram = new Histogram({
      name: 'service_database_duration_histogram',
      help: 'service_database_duration_histogram',
      labelNames: ['server', 'database', 'table', 'type'],
      buckets: [0.1, 0.5, 1, 5],
    });

    agent.messenger.on('promethus-event', data => {
      const { method, path: handler, consume, status, promServerName } = data.data;
      let target = promServerName,
        strs;
      switch (data.type) {
        case 'http_request_other':
          if (target === undefined) {
            strs = handler.split('/').filter((str, i) => {
              if (i === 0 && str.includes('http')) return false; return str;
            });
            if (strs[0] && strs[0].includes(':')) {
              target = strs[0].split(':')[0];
            } else {
              target = strs.slice(0, 2).join('/');
            }
          }
          http_depend_service_reponses_seconds.set({ server, method, target }, consume);
          http_depend_service_reponses_histogram.observe({ server, method, target }, consume);
          http_depend_service_status_histogram.observe({ server, method, target }, status);
          break;
        case 'http_request':
          http_request_total.inc({ server, method, handler }, 1);
          http_request_duration_seconds.set({ server, method, handler }, consume);
          http_request_duration_histogram.observe({ server, method, handler }, consume);
          http_request_code_histogram.observe({ server, method, handler }, status);
          break;
        case 'database':
          const { type, duration, table } = data.data;
          service_database_exec_total.inc({ server, database, type }, 1);
          service_database_exec_duration_seconds.set({ server, database, type, table }, duration);
          service_database_duration_histogram.observe({ server, database, type, table }, duration);
          break;
        default:
          break;
      }

    });
  } catch (error) {
    console.log(error);
  }
};

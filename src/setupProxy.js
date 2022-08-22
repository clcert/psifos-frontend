const { createProxyMiddleware } = require('http-proxy-middleware');
const { backendIP } = require('./server');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: backendIP,
      changeOrigin: true,
    })
  );
};
module.exports = {
  port: 8080,
  host: 'localhost',
  proxyTable: [
    {
      api: '/api',
      target: 'http://192.168.1.112:8081/'
    }
  ]
};

const express = require("express");
const path = require("path");
// const { createProxyMiddleware } = require("http-proxy-middleware");
const { port = 8080, proxyTable = [] } = require("./config.js");

const staticPath = path.join(__dirname, "../../render");
const app = express();
app.use("/", express.static(staticPath)); // 设置静态资源访问路径
// proxyTable.forEach((item) =>
//   app.use(
//     createProxyMiddleware(item.api, {
//       target: item.target, // 目标服务器 host
//       changeOrigin: true, // // 默认false，是否需要改变原始主机头为目标URL
//       ws: true, // 是否代理websockets
//     })
//   )
// );

app.listen(port, () => {
  console.log(`listen：http://localhost:${port}`);
});

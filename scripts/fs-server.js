// @ts-ignore
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.resolve(__dirname, '..', './release')));

app.get('/', (req, res) => {
  // 展示静态目录的所有文件列表
  const files = fs.readdirSync(path.resolve(__dirname, '..', './release'));

  const rsp = files.map((file) => `<a href="/${file}">${file}</a>`).join('<br>');
  res.send(rsp);

  // console.log(file);

  // fs.readFile(file, (err, data) => {
  //   if (err) {
  //     res.status(500).send(err);
  //   } else {
  //     res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
  //     res.write(data);
  //     res.end();
  //   }
  // });
});

app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});

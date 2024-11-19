// @ts-ignore
const express = require('express');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const yamlPath =
  process.platform === 'darwin' ? path.resolve(__dirname, '..', './release/latest-mac.yml') : path.resolve(__dirname, '..', './release/latest.yml');

const app = express();

app.use(express.static(path.resolve(__dirname, '..', './release')));

app.get('/', (req, res) => {
  // 展示静态目录的所有文件列表
  const files = fs.readdirSync(path.resolve(__dirname, '..', './release'));

  const rsp = files.map((file) => `<a href="/${file}">${file}</a>`).join('<br>');
  res.send(rsp);
});

app.get('/ele-app/:platform', (req, res) => {
  const yamlData = fs.readFileSync(yamlPath, 'utf8');
  const data = YAML.parse(yamlData);

  console.log(data);

  res.send(data);
});

app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});

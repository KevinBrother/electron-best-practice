// @ts-ignore
const express = require('express');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const releasePath = path.resolve(__dirname, '..', './release');
// const yamlPath =
//   process.platform === 'darwin' ? path.resolve(releasePath, 'latest-mac.yml') : path.resolve(releasePath, 'latest.yml');

const app = express();

app.use(
  express.static(path.resolve(__dirname, '..', './release'), {
    setHeaders: (res, path) => {
      console.log(`Serving static file: ${path}`);
    }
  })
);

app.get('/', (req, res) => {
  // 展示静态目录的所有文件列表
  const files = fs.readdirSync(path.resolve(__dirname, '..', './release'));

  const rsp = files.map((file) => `<a href="/${file}">${file}</a>`).join('<br>');
  res.send(rsp);
});

app.get('/api/:filename', (req, res) => {
  const filename = req.params.filename;
  console.log(`api_req.params: ${JSON.stringify(req.params)}`);
  const filePath = path.resolve(releasePath, filename);
  if(filename.endsWith('.yml')){
    const yamlData = fs.readFileSync(filePath, 'utf8');
    const data = YAML.parse(yamlData);
    res.send(data);
  } else {
    // 发送其他类型的文件
    res.sendFile(filePath);
  }
});

app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});

const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http
  .createServer((req, res) => {
    const filePath = path
      .join(__dirname, "../dist", decodeURI(req.url))
      .split("?")[0];
    // const filePath = path.join(__dirname, "../dist", req.url);
    console.log("🚀 ~ .createServer ~ filePath:", filePath);

    const { start, end } = handlerRange(req, res, filePath);
    const fileStream = fs.createReadStream(filePath, { start, end });

    fileStream.on("error", (err) => {
      console.log("🚀 ~ fileStream.on ~ err:", err);
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
    });

    fileStream.pipe(res);
  })
  .listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
  });

function handlerRange(request, response, filePath) {


  const fileSize = getFileSize(filePath); // 获取文件大小

  const range = request.headers.range;
  console.log('range', range)
  
  if(!range) {
    return {start: 0, end: fileSize - 1}
  }

  const start = parseInt(range.replace(/bytes=/, "").split("-")[0]);
  const end = fileSize - 1;


  const chunkSize = end - start + 1;

  response.writeHead(206, {
    'Content-Type': 'multipart/byteranges', // 替换为适当的内容类型
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunkSize,
  });

  return {start, end}
}

const getFileSize = (filePath) => {
  const stats = fs.statSync(filePath);
  return stats.size;
};
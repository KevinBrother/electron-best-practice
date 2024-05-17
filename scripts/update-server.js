const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http
  .createServer((req, res) => {
    const filePath = path.join(__dirname, "../dist", req.url);
    console.log("🚀 ~ .createServer ~ filePath:", filePath);
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("error", () => {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
    });

    fileStream.pipe(res);
  })
  .listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
  });


const fs = require('fs');
const path = require('path');
const { pathToFileURL, fileURLToPath } = require('url');

// 1. 获取文件路径（文件协议 URL）
// 使用 path.join 以兼容不同操作系统的路径分隔符
const filePath = path.join(__dirname, '..', 'release', 'latest.yml');
const fileURL = pathToFileURL(filePath);
console.log('文件协议 URL:', fileURL.href);

// 2. 读取文件内容（支持 file:// URL）
const absolutePath = fileURLToPath(fileURL); // 将 file:// URL 转回普通路径
const fileContent = fs.readFileSync(absolutePath, 'utf-8');

console.log('文件内容:', fileContent);

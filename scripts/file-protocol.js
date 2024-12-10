const fs = require('fs');
const path = require('path');
const { pathToFileURL, fileURLToPath } = require('url');

// 1. 获取文件路径（文件协议 URL）
const filePath = path.resolve(__dirname, '..', 'release', 'latest-mac.yml');
const fileURL = pathToFileURL(filePath);
console.log('文件协议 URL:', fileURL.href);

// 2. 读取文件内容（支持 file:// URL）
const absolutePath = fileURLToPath(fileURL); // 将 file:// URL 转回普通路径
const fileContent = fs.readFileSync(absolutePath, 'utf-8');

console.log('文件内容:', fileContent);

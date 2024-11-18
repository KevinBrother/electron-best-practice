const { Writable, Readable } = require('stream');
const fs = require('fs');
const path = require('path');

const readableStream = new Readable();

// 获取当前缓冲区大小
const bufferLength = readableStream.readableLength;
console.log('Current buffer length:', bufferLength);

const writableStream = new Writable();

// 获取缓冲区最大容量大小
const bufferCapacity = writableStream.writableHighWaterMark;
console.log('Buffer maximum capacity:', bufferCapacity);

class MyWritableStream extends Writable {
  totalBytes = [];
  _write(chunk, encoding, callback) {
    // 处理接收到的数据
    this.totalBytes.push(chunk.length);
    console.log('Received data:', chunk.toString());
    callback();
  }

  _final() {
    console.log(
      'Total bytes:',
      this.totalBytes.reduce((a, b) => a + b, 0),
      this.totalBytes
    );
  }
}

// // const fileURL = "latest.yml";
// const fileURL = "update-test-1.0.1-arm64.dmg.blockmap";
// // const fileURL = "update-test Setup 1.0.1.exe";
// const filePath = path.join(__dirname, "../dist", fileURL);
// const fileStream = fs.createReadStream(filePath);
// const writableStream = new MyWritableStream();

// fileStream.pipe(writableStream);

const { ipcRenderer } = require("electron");


let overlay = document.getElementById("overlay");
let isSelecting = false;
let startX, startY, endX, endY;

document.getElementById("captureButton").addEventListener("click", async () => {
  // 监听全局鼠标事件
  window.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
      // 只处理左键点击
      isSelecting = true;
      startX = event.clientX;
      startY = event.clientY;

      overlay.style.left = `${startX}px`;
      overlay.style.top = `${startY}px`;
      overlay.style.width = "0px";
      overlay.style.height = "0px";
      overlay.style.display = "block";
    }
  });

  window.addEventListener("mousemove", (event) => {
    if (isSelecting) {
      endX = event.clientX;
      endY = event.clientY;

      overlay.style.width = `${Math.abs(endX - startX)}px`;
      overlay.style.height = `${Math.abs(endY - startY)}px`;
      overlay.style.left = `${Math.min(startX, endX)}px`;
      overlay.style.top = `${Math.min(startY, endY)}px`;
    }
  });

  window.addEventListener("mouseup", async (event) => {
    if (isSelecting) {
      isSelecting = false;
      overlay.style.display = "none";

      // 获取屏幕截图
      const x = Math.min(startX, endX);
      const y = Math.min(startY, endY);
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);

      try {
        const screenSource = await ipcRenderer.invoke("captureSources");

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: screenSource.id,
              minWidth: width,
              maxWidth: width,
              minHeight: height,
              maxHeight: height,
            },
          },
        });

        handleStream(stream, x, y, width, height);
      } catch (e) {
        console.error("Failed to capture screenshot:", e);
      }
    }
  });
});


// 关闭
document.getElementById("closeWindow").addEventListener("click", () => {
  ipcRenderer.send("close-inner-window");
});

// 将流内容渲染到 Canvas 上，生成截图
function handleStream(stream, x, y, width, height) {
    const video = document.createElement('video');
    video.srcObject = stream;
  
    video.onloadedmetadata = () => {
      video.play();
  
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
  
      video.addEventListener('loadeddata', () => {
        ctx.drawImage(video, x, y, width, height, 0, 0, width, height);
  
        // 停止流
        stream.getTracks()[0].stop();
  
        // 将 Canvas 转为图片并显示
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.className = 'screenshot'
        document.querySelector('.screenshot')?.remove()
        document.body.appendChild(img);
      });
    };
  }

import socket
import threading

def handle_client(client_socket):
    # 连接到目标服务器
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    try:
        server_socket.connect(('100.200.24.87', 3000))
        
        # 创建两个线程处理双向数据传输
        client_to_server = threading.Thread(target=forward, args=(client_socket, server_socket))
        server_to_client = threading.Thread(target=forward, args=(server_socket, client_socket))
        
        client_to_server.daemon = True
        server_to_client.daemon = True
        
        client_to_server.start()
        server_to_client.start()
        
        # 等待任意一个方向的数据传输完成
        client_to_server.join()
        server_to_client.join()
    finally:
        client_socket.close()
        server_socket.close()

def forward(source, destination):
    try:
        while True:
            data = source.recv(4096)
            if not data:
                break
            destination.sendall(data)
    except Exception:
        pass

def start_proxy():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('localhost', 3000))
    server.listen(5)
    print("代理服务器已启动，监听地址: localhost:3000")
    
    while True:
        client_socket, client_address = server.accept()
        print(f"接收到来自 {client_address} 的连接")
        client_handler = threading.Thread(target=handle_client, args=(client_socket,))
        client_handler.daemon = True
        client_handler.start()

if __name__ == "__main__":
    start_proxy()
import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

CMDS = [
    # Start app on multiple ports
    "PORT=3000 pm2 start server.js --name backend-3000 --update-env",
    "PORT=8080 pm2 start server.js --name backend-8080 --update-env",
    "PORT=8000 pm2 start server.js --name backend-8000 --update-env",
    "exit"
]

def read_until(fd, marker):
    buf = b""
    while True:
        try:
            chunk = os.read(fd, 1)
            if not chunk: break
            buf += chunk
            if marker in buf: return buf
        except OSError: break
    return buf

def deploy():
    print(f"🚀 Launching Multi-Port API on {HOST}...")
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp("ssh", ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=10", HOST])
    else:
        try:
            out = read_until(fd, b"password:")
            if b"password:" in out:
                os.write(fd, (PASSWORD + "\n").encode())
            
            time.sleep(2)
            for cmd in CMDS:
                os.write(fd, (cmd + "\n").encode())
                time.sleep(0.5)
            
            time.sleep(2)
        except OSError: pass

if __name__ == "__main__":
    deploy()

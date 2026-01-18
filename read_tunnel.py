import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

CMDS = [
    # Force flush the log to stdout
    "cat tunnel.log",
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
    print(f"🚀 Reading Tunnel Log from {HOST}...")
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp("ssh", ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=10", HOST])
    else:
        try:
            out = read_until(fd, b"password:")
            if b"password:" in out:
                os.write(fd, (PASSWORD + "\n").encode())
                
            time.sleep(2)
            
            # Send cat command
            os.write(fd, (b"grep trycloudflare.com tunnel.log\n"))
            time.sleep(0.5)
            
            # Read ALL output
            print("--- LOG START ---")
            while True:
                try:
                    chunk = os.read(fd, 4096)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                    sys.stdout.flush()
                except: break
            print("\n--- LOG END ---")
                
        except OSError: pass

if __name__ == "__main__":
    deploy()

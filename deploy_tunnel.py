import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

CMDS = [
    # 1. Download cloudflared
    "wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb",
    "dpkg -i cloudflared-linux-amd64.deb",
    
    # 2. Start Tunnel (Background)
    # targeting the Node app on 5001
    "nohup cloudflared tunnel --url http://localhost:5001 > tunnel.log 2>&1 &",
    
    # 3. Wait and Retrieve URL
    "sleep 10",
    "cat tunnel.log | grep trycloudflare.com",
    "exit"
]

def read_until(fd, marker):
    buf = b""
    while True:
        try:
            chunk = os.read(fd, 1)
            if not chunk: break
            buf += chunk
            # sys.stdout.buffer.write(chunk)
            if marker in buf: return buf
        except OSError: break
    return buf

def deploy():
    print(f"🚀 Launching Cloudflare Tunnel on {HOST}...")
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp("ssh", ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=10", HOST])
    else:
        try:
            out = read_until(fd, b"password:")
            if b"password:" in out:
                os.write(fd, (PASSWORD + "\n").encode())
                print("🔑 Password sent.")
            
            time.sleep(2)
            for cmd in CMDS:
                print(f"Exec: {cmd}")
                os.write(fd, (cmd + "\n").encode())
                time.sleep(2)
            
            # Read output specifically looking for URL
            print("📜 Finding Tunnel URL...")
            while True:
                try:
                    chunk = os.read(fd, 4096)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                    sys.stdout.flush()
                except: break
                
        except OSError: pass
        finally: print("\n✅ Tunnel Launch Complete.")

if __name__ == "__main__":
    deploy()

import pty
import os
import sys
import time
import re

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

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
    print(f"🚀 Starting Sync Tunnel on {HOST}...")
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp("ssh", ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=10", HOST])
    else:
        try:
            out = read_until(fd, b"password:")
            if b"password:" in out:
                os.write(fd, (PASSWORD + "\n").encode())
            
            time.sleep(2)
            
            # Run cloudflared directly (no nohup)
            os.write(fd, (b"cloudflared tunnel --url http://localhost:5001\n"))
            
            # Read for 15 seconds to find URL
            full_out = b""
            start = time.time()
            found_url = False
            while time.time() - start < 15:
                try:
                    chunk = os.read(fd, 1024)
                    if not chunk: break
                    full_out += chunk
                    sys.stdout.buffer.write(chunk)
                    sys.stdout.flush()
                    
                    if b"trycloudflare.com" in chunk or b"trycloudflare.com" in full_out:
                        print("\n✅ URL FOUND!")
                        found_url = True
                        break
                except: break
            
            # Cleanup
            os.write(fd, (b"\x03")) # Ctrl+C
            time.sleep(1)
            os.write(fd, (b"exit\n"))
                
        except OSError: pass

if __name__ == "__main__":
    deploy()

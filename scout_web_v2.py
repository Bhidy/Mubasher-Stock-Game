import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

CMDS = [
    # Basic directory checks
    "echo '--- CHECKING /var/www ---'",
    "ls -la /var/www/",
    "echo '--- CHECKING /var/www/html ---'",
    "ls -la /var/www/html/ 2>/dev/null",
    
    # Check potential LiteSpeed roots
    "echo '--- CHECKING /usr/local/lsws ---'",
    "ls -la /usr/local/lsws/ 2>/dev/null",
    
    # Process check (what is lshttpd serving?)
    "echo '--- PROCESS ARGS ---'",
    "ps aux | grep lshttpd | head -n 1",
    
    # Ensure Port 5001 is ALIVE locally
    "echo '--- PORT 5001 CHECK ---'",
    "pm2 start stock-hero-backend/server.js --name backend-5001 --port 5001 --update-env",
    "curl -v http://localhost:5001/api/stocks?market=US",
    "exit"
]

def read_until(fd, marker, timeout=5):
    buf = b""
    start = time.time()
    while time.time() - start < timeout:
        try:
            chunk = os.read(fd, 1)
            if not chunk: break
            buf += chunk
            if marker in buf: return buf
        except OSError: time.sleep(0.01)
    return buf

def deploy():
    print(f"🚀 Scouting V2 on {HOST}...")
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp("ssh", ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=10", HOST])
    else:
        try:
            out = read_until(fd, b"password:", 10)
            if b"password:" in out:
                os.write(fd, (PASSWORD + "\n").encode())
                print("🔑 Password sent.")
            
            time.sleep(2)
            
            for cmd in CMDS:
                os.write(fd, (cmd + "\n").encode())
                time.sleep(1)
            
            # Use os.read loop to drain buffer completely
            print("📜 Output:")
            while True:
                try:
                    chunk = os.read(fd, 4096)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                    sys.stdout.flush()
                except OSError: break
                
        except OSError: pass
        finally: print("\n✅ Scout Complete.")

if __name__ == "__main__":
    deploy()

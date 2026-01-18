import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

CMDS = [
    # Find active web roots
    "ls -la /var/www/html",
    "ls -la /home/*/public_html",
    
    # Check if we can write .htaccess
    "echo 'Checking Write Access...'",
    
    # Check OpenLiteSpeed config location
    "find /usr/local/lsws -name httpd_config.conf",
    
    # Ensure App is running on 5001
    "PORT=5001 pm2 restart stock-hero-backend --update-env || pm2 start stock-hero-backend/server.js --name stock-hero-backend --port 5001",
    "pm2 save",
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
    print(f"🚀 Scouting Web Configuration on {HOST}...")
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
                time.sleep(1)
            
            # Read output
            time.sleep(2)
            while True:
                try:
                    chunk = os.read(fd, 4096)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                except: break
                
        except OSError: pass
        finally: print("\n✅ Scout Complete.")

if __name__ == "__main__":
    deploy()

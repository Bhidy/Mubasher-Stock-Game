import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

# Smart Proxy Setup
CMDS = [
    # 1. Ensure Backend on 5001
    "cd stock-hero-backend",
    "git pull",
    "npm install --production",
    "psql -U postgres -d mubasher_stock_game -f migrations/002_add_cache_tables.sql",
    "PORT=5001 pm2 stop stock-hero-backend || true",
    "PORT=5001 pm2 start server.js --name stock-hero-backend --update-env",
    "pm2 save",
    
    # 2. Configure LiteSpeed Proxy (Using .htaccess)
    "cd /var/www/html",
    # Clear existing index.html if it's just the default page
    "rm index.html || true", 
    # Create valid JSON file on root to prove we own it
    "echo '{\"status\":\"Stock Hero Proxy Active\"}' > index.json", 
    
    # Create .htaccess for Proxy Pass
    "echo 'RewriteEngine On' > .htaccess",
    "echo 'RewriteRule ^api/(.*)$ http://127.0.0.1:5001/api/$1 [P,L]' >> .htaccess",
    
    # Restart LiteSpeed to pick up changes (Graceful)
    "systemctl reload lsws || systemctl reload openlitespeed || service lshttpd reload",
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
    print(f"🚀 Deploying Smart Proxy to {HOST}...")
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
            
            time.sleep(2)
            while True:
                try:
                    chunk = os.read(fd, 1024)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                except: break
                
        except OSError: pass
        finally: print("\n✅ Smart Proxy Deployed.")

if __name__ == "__main__":
    deploy()

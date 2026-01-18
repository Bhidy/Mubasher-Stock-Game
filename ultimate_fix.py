import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

# The "Chief Expert" Command Sequence
CMDS = [
    # 1. IDENTIFY & DESTROY
    # Masking prevents manual or automatic start
    "systemctl mask lsws",
    "systemctl stop lsws",
    "systemctl mask openlitespeed",
    "systemctl stop openlitespeed",
    "systemctl mask apache2",
    "systemctl stop apache2",
    "systemctl mask nginx",
    "systemctl stop nginx",
    
    # 2. FORCE KILL (The Double Tap)
    "fuser -k -9 80/tcp",
    "killall -9 lshttpd",
    "killall -9 openlitespeed",
    "killall -9 httpd",
    
    # 3. VERIFY PORT IS FREE
    "echo 'Checking Port 80 status...'",
    "lsof -i :80",
    
    # 4. DEPLOY APP
    "cd stock-hero-backend",
    "git pull",
    "npm install --production",
    "psql -U postgres -d mubasher_stock_game -f migrations/002_add_cache_tables.sql",
    
    # 5. START ON PORT 80
    "pm2 delete all", # Clear old configs
    "PORT=80 pm2 start server.js --name stock-hero-backend --update-env",
    "pm2 start workers/ingest_worker.js --name stock-hero-ingest --cron \"*/5 * * * *\" --no-autorestart",
    "pm2 save",
    
    # 6. FINAL VERIFICATION
    "curl -v http://localhost:80/api/stocks?market=US",
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
    print(f"🚀 Executing ULTIMATE FIX on {HOST}...")
    pid, fd = pty.fork()
    if pid == 0:
        os.execvp("ssh", ["ssh", "-o", "StrictHostKeyChecking=no", "-o", "ConnectTimeout=10", HOST])
    else:
        try:
            out = read_until(fd, b"password:")
            if b"password:" in out:
                os.write(fd, (PASSWORD + "\n").encode())
                print("🔑 Password sent.")
            
            time.sleep(3)
            
            for cmd in CMDS:
                print(f"Exec: {cmd}")
                os.write(fd, (cmd + "\n").encode())
                # Wait longer for heavy commands
                if "npm install" in cmd: time.sleep(10)
                elif "pull" in cmd: time.sleep(5)
                else: time.sleep(1)
            
            # Read output loop
            time.sleep(2)
            print("📜 Remote Logs:")
            while True:
                try:
                    chunk = os.read(fd, 4096)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                    sys.stdout.flush()
                except: break
                
        except OSError: pass
        finally: print("\n✅ Ultimate Fix Complete.")

if __name__ == "__main__":
    deploy()

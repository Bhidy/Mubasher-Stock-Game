import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

# Command to enable Rewrite in OLS config if possible, or restart harder
CMDS = [
    # 1. Check if .htaccess exists where we put it
    "ls -l /var/www/html/.htaccess",
    "cat /var/www/html/.htaccess",
    
    # 2. Force Restart OpenLiteSpeed (Hard)
    "/usr/local/lsws/bin/lswsctrl restart",
    
    # 3. Check for other vhosts
    "grep -r 'docRoot' /usr/local/lsws/conf/ 2>/dev/null",
    
    # 4. If all else fails, hijack index.php/html
    # We can write a PHP proxy script as a fallback if OLS supports PHP
    "echo \"<?php header('Location: http://stock-hero-backend.hetzner.app:5001/api' . \$_SERVER['REQUEST_URI'], true, 307); ?>\" > /var/www/html/api_proxy.php",
    
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
    print(f"🚀 Debugging Proxy on {HOST}...")
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
                    chunk = os.read(fd, 4096)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                except: break
        except OSError: pass
        finally: print("\n✅ Debug Complete.")

if __name__ == "__main__":
    deploy()

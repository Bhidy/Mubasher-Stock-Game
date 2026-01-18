import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

# Command chain that writes to a file, then reads it back
CMD_CHAIN = [
    "echo '--- START ---' > /tmp/scout.log",
    "ls -la /var/www/html >> /tmp/scout.log 2>&1",
    "ls -la /usr/local/lsws/Example/html >> /tmp/scout.log 2>&1", # Standard OLS path
    "ps aux | grep :80 >> /tmp/scout.log 2>&1",
    "cat /tmp/scout.log", # Dump to stdout for capture
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
    print(f"🚀 Scouting V3 (File Dump) on {HOST}...")
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
            
            # Send commands
            for cmd in CMD_CHAIN:
                os.write(fd, (cmd + "\n").encode())
                time.sleep(0.5)
            
            # Aggressive Read Loop
            time.sleep(1)
            while True:
                try:
                    chunk = os.read(fd, 4096)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                    sys.stdout.flush()
                except OSError: break
                
        except OSError: pass
        finally: print("\n✅ Scout Finished.")

if __name__ == "__main__":
    deploy()

import pty
import os
import sys
import time

PASSWORD = "StartaProd2026!"
HOST = "root@stock-hero-backend.hetzner.app"

CMDS = [
    # write test file
    "echo '<?php echo \"PHP_IS_ALIVE\"; ?>' > /var/www/html/test_alive.php",
    "chown nobody:nogroup /var/www/html/test_alive.php || chmod 777 /var/www/html/test_alive.php",
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
    print(f"🚀 Deploying PHP Test to {HOST}...")
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
                os.write(fd, (cmd + "\n").encode())
                time.sleep(1)
            
            time.sleep(1)
            while True:
                try:
                    chunk = os.read(fd, 1024)
                    if not chunk: break
                    sys.stdout.buffer.write(chunk)
                except: break
                
        except OSError: pass

if __name__ == "__main__":
    deploy()

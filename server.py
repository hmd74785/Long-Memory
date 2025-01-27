from http.server import HTTPServer, SimpleHTTPRequestHandler
import socket
import sys

# تعيين ترميز المخرجات إلى UTF-8
sys.stdout.reconfigure(encoding='utf-8')

def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

ip = get_ip()
port = 8000

Handler = SimpleHTTPRequestHandler
Handler.extensions_map.update({
    '.webapp': 'application/x-web-app-manifest+json',
})

httpd = HTTPServer((ip, port), Handler)
print(f'\nافتح هذا الرابط في متصفح جوالك:')
print(f'http://{ip}:{port}\n')

try:
    httpd.serve_forever()
except KeyboardInterrupt:
    print('\nتم إيقاف الخادم')

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.argv[2] || 8002;
const ROOT = process.argv[3] || __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.ttf':  'font/ttf',
  '.otf':  'font/otf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.apk':  'application/vnd.android.package-archive',
  '.zip':  'application/zip',
  '.ico':  'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

const https = require('https');

const server = http.createServer((req, res) => {
  // PROXY DE IMÁGENES PARA VEXEL 3D AI
  if (req.url.startsWith('/api/proxy?url=')) {
      const targetUrl = decodeURIComponent(req.url.split('?url=')[1]);
      console.log(`[Proxy] Descargando imagen: ${targetUrl}`);

      const requestModule = targetUrl.startsWith('https') ? https : http;
      
      requestModule.get(targetUrl, (proxyRes) => {
          if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302) {
              const redirectUrl = proxyRes.headers.location;
              console.log(`[Proxy] Redirigiendo a: ${redirectUrl}`);
              return requestModule.get(redirectUrl, (redirectRes) => {
                  res.writeHead(redirectRes.statusCode, {
                      'Content-Type': redirectRes.headers['content-type'],
                      'Access-Control-Allow-Origin': '*'
                  });
                  redirectRes.pipe(res);
              });
          }

          res.writeHead(proxyRes.statusCode, {
              'Content-Type': proxyRes.headers['content-type'],
              'Access-Control-Allow-Origin': '*'
          });
          proxyRes.pipe(res);
      }).on('error', (err) => {
          console.error(`[Proxy] Error:`, err);
          res.writeHead(500, { 'Access-Control-Allow-Origin': '*' });
          res.end('Error fetching image');
      });
      return;
  }

  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, decodeURIComponent(urlPath));
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';
  // Si la ruta apunta a un directorio, servir su index.html
  fs.stat(filePath, (statErr, stats) => {
    let targetPath = filePath;
    if (!statErr && stats.isDirectory()) {
      targetPath = path.join(filePath, 'index.html');
    }

    fs.readFile(targetPath, (err, data) => {
      if (err) {
        console.log('[404]', urlPath, '->', targetPath);
        res.writeHead(404, { 
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        });
        res.end('<h2>404 - No encontrado</h2><p>' + targetPath + '</p>');
      } else {
        const ext2 = path.extname(targetPath).toLowerCase();
        const contentType2 = MIME[ext2] || 'application/octet-stream';
        console.log('[200]', urlPath, '->', targetPath);
        res.writeHead(200, { 
            'Content-Type': contentType2,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
        });
        res.end(data);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('  Servidor corriendo en: http://localhost:' + PORT);
  console.log('  Carpeta: ' + ROOT);
  console.log('  Presiona Ctrl+C para detener');
  console.log('');
});

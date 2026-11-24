const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8001;

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    // 1. ENDPOINT DEL PROXY DE IMÁGENES
    if (req.url.startsWith('/api/proxy?url=')) {
        const targetUrl = decodeURIComponent(req.url.split('?url=')[1]);
        console.log(`[Proxy Backend] Descargando imagen: ${targetUrl}`);

        const requestModule = targetUrl.startsWith('https') ? https : http;
        
        requestModule.get(targetUrl, (proxyRes) => {
            if (proxyRes.statusCode === 301 || proxyRes.statusCode === 302 || proxyRes.statusCode === 307 || proxyRes.statusCode === 308) {
                let redirectUrl = proxyRes.headers.location;
                if (redirectUrl.startsWith('/')) {
                    const origin = new URL(targetUrl).origin;
                    redirectUrl = origin + redirectUrl;
                }
                console.log(`[Proxy Backend] Redirigiendo a: ${redirectUrl}`);
                const redirectModule = redirectUrl.startsWith('https') ? https : http;
                return redirectModule.get(redirectUrl, (redirectRes) => {
                    res.writeHead(redirectRes.statusCode, {
                        'Content-Type': redirectRes.headers['content-type'],
                        'Access-Control-Allow-Origin': '*'
                    });
                    redirectRes.pipe(res);
                }).on('error', (err) => {
                    res.writeHead(500, { 'Access-Control-Allow-Origin': '*' });
                    res.end('Error following redirect: ' + err.message);
                });
            }

            res.writeHead(proxyRes.statusCode, {
                'Content-Type': proxyRes.headers['content-type'],
                'Access-Control-Allow-Origin': '*'
            });
            proxyRes.pipe(res);
        }).on('error', (err) => {
            console.error(`[Proxy Backend] Error:`, err);
            res.writeHead(500, { 'Access-Control-Allow-Origin': '*' });
            res.end('Error fetching image');
        });
        return;
    }

    // 2. SERVIDOR DE ARCHIVOS ESTÁTICOS
    let filePath = '.' + req.url.split('?')[0];
    if (filePath === './' || filePath === './index.html') {
        filePath = './index.html';
    } else {
        // Soporte si piden /app%20vexel/... (aunque estemos dentro)
        filePath = decodeURIComponent(filePath);
        if (filePath.startsWith('./app vexel/')) {
            filePath = filePath.replace('./app vexel/', './');
        }
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                console.log(`[Static] 404 Not Found: ${filePath}`);
                res.writeHead(404);
                res.end('Archivo no encontrado');
            } else {
                console.log(`[Static] 500 Error: ${filePath}`);
                res.writeHead(500);
                res.end('Error del servidor: '+error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Vexel 3D Backend Server está corriendo`);
    console.log(`🌐 Aplicación: http://localhost:${PORT}`);
    console.log(`✅ Proxy activo en /api/proxy`);
    console.log(`=========================================`);
});

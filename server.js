import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = Number(process.env.PORT) || 3000;

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js':   'text/javascript; charset=UTF-8',
  '.css':  'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2'
};

// Check dist directory exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('');
  console.error(' ERROR: dist/ folder not found!');
  console.error(' Please run:  npm run build');
  console.error(' Then re-run: node server.js');
  console.error('');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  // SPA routing fallback
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
        });
        res.end(content);
      }
    });
  });
});

// Handle address already in use — try next port
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`\n Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    server.listen(PORT + 1, '0.0.0.0');
  } else {
    console.error(' Server error:', err.message);
    process.exit(1);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const actualPort = server.address().port;
  const localUrl = `http://localhost:${actualPort}`;
  const lanUrl = `http://${getLanIp()}:${actualPort}`;
  console.log('');
  console.log(' ====================================================');
  console.log('  Athena Library System - Live Production Server');
  console.log(' ====================================================');
  console.log(`  Local URL (This PC) : ${localUrl}`);
  console.log(`  LAN URL (Other PCs) : ${lanUrl}`);
  console.log(' ====================================================');
  console.log('');

  // Auto-open browser
  const startCmd = process.platform === 'win32'
    ? `start "" "${localUrl}"`
    : (process.platform === 'darwin' ? `open "${localUrl}"` : `xdg-open "${localUrl}"`);

  exec(startCmd, (err) => {
    if (err) console.log(`  Please open ${localUrl} in your browser.`);
  });
});

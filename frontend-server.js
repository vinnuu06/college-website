const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {
  // Default to index.html
  let filePath = req.url === '/' ? '/index.html' : req.url;
  
  // Security: prevent directory traversal
  filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, '');
  filePath = path.join(__dirname, filePath);

  // Get file extension
  const ext = path.extname(filePath).toLowerCase();
  
  // Set content type
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
  };

  const contentType = contentTypes[ext] || 'application/octet-stream';

  // Read and serve file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If file not found, try to serve index.html (for SPA routing)
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Server Error</h1>');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═════════════════════════════════════════╗
║   📱 FRONTEND SERVER RUNNING            ║
╠═════════════════════════════════════════╣
║   Port: ${PORT}                              ║
║   Local URL: http://localhost:${PORT}     ║
║   Mobile URL: http://192.168.0.100:${PORT} ║
║                                         ║
║   Backend: http://192.168.0.100:5000    ║
╚═════════════════════════════════════════╝
  `);
});

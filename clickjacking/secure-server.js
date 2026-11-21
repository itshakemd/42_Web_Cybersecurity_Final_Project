/*
  secure-server.js
  Minimal Node.js (no dependencies) static server that demonstrates the
  HTTP-header-based fix for clickjacking. Run with:

      node secure-server.js

  Then open http://localhost:8080/mitigated-site.html directly, and try
  to load it inside one of the attack-*.html pages' iframe (point an
  attack page's iframe src at this URL) - it should refuse to render.

  Compare against: node simple-server-no-headers.js (vulnerable-site.html)
  which sends no protective headers at all.
*/
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
};

http.createServer((req, res) => {
  let filePath = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (filePath.endsWith('/')) filePath += 'index.html';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = path.extname(filePath);
    const headers = {
      'Content-Type': MIME[ext] || 'application/octet-stream',
    };

    // --- THE ACTUAL FIX ---
    // Only the mitigated page gets the protective headers, so you can
    // compare behavior side-by-side against vulnerable-site.html served
    // from the same process.
    if (filePath.endsWith('mitigated-site.html')) {
      headers['X-Frame-Options'] = 'DENY';
      headers['Content-Security-Policy'] = "frame-ancestors 'none'";
      // Also shown for completeness - cookie hardening (needs HTTPS for Secure):
      // res.setHeader('Set-Cookie', 'session=abc123; SameSite=Strict; Secure; HttpOnly');
    }

    res.writeHead(200, headers);
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Serving ${ROOT} at http://localhost:${PORT}`);
  console.log('Try: http://localhost:8080/vulnerable-site.html   (no protection)');
  console.log('Try: http://localhost:8080/mitigated-site.html    (protected)');
});

const http = require('http');
const fs = require('fs');
const path = require('path');

const portNo = 8000;
const publicDir = path.join(__dirname, 'public');

const staticFiles = (res, filePath, contentType) => {
    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('File Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
};

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        staticFiles(res, path.join(publicDir, 'index.html'), 'text/html');
    } else if (req.url.match(/.css$/)) {
        staticFiles(res, path.join(publicDir, req.url), 'text/css');
    } else if (req.url.match(/.js$/)) {
        staticFiles(res, path.join(publicDir, req.url), 'application/javascript');
    } else if (req.url === '/questions') {
        fs.readFile(path.join(__dirname, 'questions.json'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to load questions' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});


server.listen(portNo, () => {
    console.log("Server is running at 8000");
});

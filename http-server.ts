const http = require('http');


const server = http.createServer((req, res) => {
    function sendJson(status, data) {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    if(req.method === 'GET' && req.url === '/ping'){
        return sendJson(200, { message: 'pong' });
    }


    if(req.method === 'POST' && req.url === '/echo'){
        const chunks = []

        req.on('data', (chunk) => {
           chunks.push(chunk);
        });

        req.on('end', () => {
            const body = Buffer.concat(chunks).toString('utf8');
            try {
                const json = JSON.parse(body);
                return sendJson(200, {received: json});
            } catch (error) {
                return sendJson(400, { message: `Bad Request: ${error}` });
            }
        });

        req.on('error', (error) => {
            return sendJson(400, { message: `Bad Request: ${error}` });
        });
        return;
    }


    return sendJson(404, { message: 'Not Found' });
})

server.listen(3001, () => {
    console.log('Server is running on port 3001');
})

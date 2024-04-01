
const net = require("net");
const fs = require('fs');

// You can use print statements as follows for debugging, they'll be visible when running tests.
const [nodePath, scriptPath, ...args] = process.argv;
function getArgValue(argName) {
    return args[args.findIndex(arg => arg === '--directory') + 1];
}

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    socket.on("data", (data) => {
        const [__headers, _body] = data.toString().split("\r\n\r\n");
        const _headers = __headers.split('\r\n');
        const firstLine = _headers.shift().split(' ');
        const [method, path, pro] = firstLine
        const headers = {};
        _headers.forEach((header) => {
            const [key, value] = header.split(':')
            headers[key.trim()] = value.trim()
        })
        if (path.startsWith('/files/')) {
            const fileName = path.replace('/files/', '');
            const filePath = `${fs.realpathSync(getArgValue('--directory'))}/${fileName}`
            if(!fs.existsSync(filePath)){
                socket.write("HTTP/1.1 404 OK\r\n\r\n");
                socket.end();
                return;
            }
            const fileContent = fs.readFileSync(filePath).toString()
            const headers = [
                'HTTP/1.1 200 OK',
                'Content-Type: application/octet-stream',
                `Content-Length: ${fileContent.length}`,
            ]
            let response = headers.join("\r\n");
            response += '\r\n\r\n';
            response += fileContent;
            socket.write(response);
            socket.end();
1
            return;
        }
        if (path.startsWith('/echo/')) {
            const text = path.replace('/echo/', '');
            const headers = [
                'HTTP/1.1 200 OK',
                'Content-Type: text/plain',
                `Content-Length: ${text.length}`,
            ]
            let response = headers.join("\r\n");
            response += '\r\n\r\n';
            response += text;
            socket.write(response);
            socket.end();
            return;
        }
        if (path === '/user-agent') {
            const resHeaders = [
                'HTTP/1.1 200 OK',
                'Content-Type: text/plain',
                `Content-Length: ${headers['User-Agent'].length}`,
            ]
            let response = resHeaders.join("\r\n");
            response += '\r\n\r\n';
            response += headers['User-Agent'];
            socket.write(response);
            socket.end();
            return;
        }
        if (path === '/') {
            socket.write("HTTP/1.1 200 OK\r\n\r\n");
            socket.end();
            return;
        }
        socket.write("HTTP/1.1 404 OK\r\n\r\n");
        socket.end();
    });
    socket.on("close", () => {
        socket.end();
        server.close();
    });
});
server.listen(4221, "localhost");
const net = require("net");
const { CRLF } = require("./constants");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const startLine = request.split(CRLF)[0];
    const path = startLine.split(' ')[1];
    if(path === '/')
        socket.write(`HTTP/1.1 200 OK${CRLF}${CRLF}`);
    else
        socket.write(`HTTP/1.1 404 Not Found${CRLF}${CRLF}`)
    });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");

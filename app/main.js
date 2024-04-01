const net = require("net");
const { CRLF } = require("./constants");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    socket.write(`HTTP/1.1 200 OK${CRLF}${CRLF}`);
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");

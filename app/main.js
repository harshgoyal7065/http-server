const net = require("net");
const { CRLF } = require("./constants");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const req = data.toString().split(CRLF);
    const path = req[0].split(" ")[1].trim();
    if (path.startsWith("/echo/")) {
      const val = path.substring(6);
      return socket.write(
        `HTTP/1.1 200 OK${CRLF}Content-Type: text/plain${CRLF}Content-Length:${val.length}${CRLF}${CRLF}${val}${CRLF}`
      );
    }
    if (path === "" || path === "/") {
        socket.write(`HTTP/1.1 200 OK${CRLF}${CRLF}`);
      } else {
        socket.write(`HTTP/1.1 404 Not Found${CRLF}${CRLF}`);
      }
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");

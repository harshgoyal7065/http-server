const net = require("net");
const { CRLF } = require("./constants");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const req = data.toString().split("\r\n");
    const path = req[0].split(" ")[1].trim();
    if (path.startsWith("/echo/")) {
      const val = path.substring(6);
      return socket.write(
        "HTTP/1.1 200 OK\r\n" +
          "Content-Type: text/plain\r\n" +
          "Content-Length: " +
          val.length +
          "\r\n\r\n" +
          val +
          "\r\n"
      );
    }
  });

  socket.on("close", () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, "localhost");

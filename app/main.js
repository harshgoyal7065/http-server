const net = require("net");
const { CRLF } = require("./constants");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const [__headers, _body] = data.toString().split("\r\n\r\n");
    const _headers = __headers.split("\r\n");
    const firstLine = _headers.shift().split(" ");
    const [method, path, pro] = firstLine;
    const headers = {};
    _headers.forEach((header) => {
      const [key, value] = header.split(":");
      headers[key.trim()] = value.trim();
    });
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
        return;
    }
    if (path === "/user-agent") {
      const resHeaders = [
        "HTTP/1.1 200 OK",
        "Content-Type: text/plain",
        `Content-Length: ${headers["User-Agent"].length}`,
      ];
      let response = resHeaders.join(CRLF);
      response += CRLF;
      response += headers["User-Agent"];
      socket.write(response);
      return;
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

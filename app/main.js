
const net = require("net");
// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");
// Handled multiple connections
const server = net.createServer((socket) => {
  socket.setEncoding("utf-8");
  socket.on("close", () => {
    socket.end();
    server.close();
  });

  socket.on("data", (data) => {
    let request_data = data.split("\r\n");
    if (!request_data.length) {
      return;
    }
    let path = request_data.shift().split(" ")[1];
    if (path.startsWith("/echo/")) {
      const val = path.substring(6);
      let response_string = "HTTP/1.1 200 OK\r\n";
      response_string += "Content-Type: text/plain\r\n";
      response_string += `Content-Length: ${val.length}\r\n\r\n`;
      response_string += val;
1
      socket.write(response_string);
    }
    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
      return;
    } else if (path === '/user-agent') {
      const user_agent = request_data[1].split(' ')[1];
      let response_string = "HTTP/1.1 200 OK\r\n";
      response_string += "Content-Type: text/plain\r\n";
      response_string += `Content-Length: ${user_agent.length}\r\n\r\n`;
      response_string += user_agent;
1
      socket.write(response_string);
    } else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });
});

server.listen(4221, "localhost");
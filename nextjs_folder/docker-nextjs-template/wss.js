import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.send("Hey its server :D");

    socket.on("set username", (username) => {
      socket.username = username;
      console.log("Set this username: ", socket.username);
    });

    socket.on("chat message", (msg) => {
      if (socket.username) io.emit("response", socket.username + ": " + msg);
      else io.emit("response", "Unknown:" + " " + msg);
    });

    sendNotification(socket);
  });
  function sendNotification(socket) {
    socket.emit("notify", "notification!");
    console.log("ran Notify");
    setTimeout(() => sendNotification(socket), 1000 * 60);
  }

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

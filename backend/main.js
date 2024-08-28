import { Server } from "socket.io";
import Apple from "./apple.js";
import Player from "./player.js";

const io = new Server(3000, { cors: { origin: "*" } });
const apple = new Apple();

io.use((socket, next) => {
  const { nickname } = socket.handshake.auth;
  socket.nickname = nickname;
  next();
});

io.on("connection", (socket) => {
  socket.player = new Player();

  socket.emit("set_apple", apple.getState());

  let ignoreCount = 0;

  socket.on("set_player", (state) => {
    if (socket.player.dead) {
      console.log(++ignoreCount);
      return;
    }

    socket.player.setState(...state);

    if (socket.player.collideItself() || socket.player.collideEdges()) {
      socket.player.dead = true;
      socket.emit("respawn", () => {
        socket.player.respawn();
        socket.player.dead = false;
      });
    } else if (socket.player.collideApple(apple.instance)) {
      apple.replace();
      socket.emit("set_apple", apple.getState(), true);
    }
  });
});

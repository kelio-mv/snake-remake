import { Server } from "socket.io";
import Apple from "./apple.js";
import Player from "./player.js";

const port = 3000;
const io = new Server(port, { cors: { origin: "*" } });
const apple = new Apple();

function isNicknameInUse(nickname) {
  for (const [id, socket] of io.sockets.sockets) {
    if (socket.nickname === nickname) {
      return true;
    }
  }
}

io.use((socket, next) => {
  const { nickname } = socket.handshake.auth;

  if (isNicknameInUse(nickname)) {
    next(new Error("login error"));
    return;
  }

  socket.nickname = nickname;
  next();
});

io.on("connection", (socket) => {
  socket.player = new Player();

  socket.emit("set_apple", apple.getState());

  socket.on("set_player", (state) => {
    if (socket.player.dead) {
      // Ignore state updates sent before respawn to prevent multiple deaths from occurring
      return;
    }

    socket.player.setState(...state);

    if (socket.player.collideItself() || socket.player.collideEdges()) {
      socket.player.die();
      socket.emit("respawn");
    } else if (socket.player.collideApple(apple.instance)) {
      apple.replace();
      socket.emit("set_apple", apple.getState(), true);
      socket.broadcast.emit("set_apple", apple.getState());
    } else {
      socket.broadcast.emit("set_player", socket.nickname, state);
    }
  });

  socket.on("respawn", () => {
    /**
     * When I used the acknowledgement in the 'respawn' request, the player sometimes respawned twice.
     * I believe this happened because socket.io prioritizes acknowledgment packets over normal events,
     * causing the player to respawn before receiving the last state update that should have been ignored.
     */
    socket.player.respawn();
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("remove_player", socket.nickname);
  });
});

console.log("Server is running on port", port);

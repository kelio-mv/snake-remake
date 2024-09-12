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

function socketsExcept(socket) {
  return Array.from(io.sockets.sockets.values()).filter((s) => s !== socket);
}

io.use((socket, next) => {
  const { nickname } = socket.handshake.auth;

  if (isNicknameInUse(nickname)) {
    next(new Error("login error"));
    return;
  }

  socket.nickname = nickname;
  socket.player = new Player();
  next();
});

io.on("connection", (socket) => {
  const { player } = socket;

  socket.emit("apple", apple.getState());

  socket.on("update", (state) => {
    if (player.dead) {
      // Ignore state updates sent before respawn to prevent multiple deaths from occurring
      return;
    }

    player.setState(...state);
    socket.broadcast.emit("player", socket.nickname, state);

    for (const oppSocket of socketsExcept(socket)) {
      const opponent = oppSocket.player;

      if (!opponent.dead && player.collidePlayer(opponent)) {
        player.die();
        socket.emit("respawn");

        if (opponent.collidePlayer(player)) {
          opponent.die();
          oppSocket.emit("respawn");
        }

        return;
      }
    }

    if (player.collideItself() || player.collideEdges()) {
      player.die();
      socket.emit("respawn");
      return;
    }

    if (player.collideApple(apple.instance)) {
      apple.replace();
      socket.emit("apple", apple.getState(), true);
      socket.broadcast.emit("apple", apple.getState());
    }
  });

  socket.on("respawn", () => {
    /**
     * When I used the acknowledgement in the 'respawn' request, the player sometimes respawned twice.
     * I believe this happened because socket.io prioritizes acknowledgment packets over normal events,
     * causing the player to respawn before receiving the last state update that should have been ignored.
     */
    player.respawn();
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("player_disconnect", socket.nickname);
  });
});

console.log("Server is running on port", port);

// Fix CORS origin
// We may need to warn players about their opponents' deaths
// Maybe we should broadcast player state after collision checks to reduce lag

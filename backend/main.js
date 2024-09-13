import { Server } from "socket.io";
import Apple from "./apple.js";
import Player from "./player.js";
import { IMMUNITY_TIME } from "./constants.js";

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
  const setImmunityTimeout = () => {
    return setTimeout(() => {
      player.removeImmunity();
      socket.emit("immunity_expire");
      socket.broadcast.emit("immunity_expire", socket.nickname);
    }, 1000 * IMMUNITY_TIME);
  };

  socket.broadcast.emit("player_connect", socket.nickname);
  socket.emit("apple", apple.getState());
  socket.immunityTimeout = setImmunityTimeout();

  socket.on("update", (state) => {
    // Ignore state updates sent before respawn to prevent multiple deaths from occurring
    if (player.dead) {
      return;
    }

    player.setState(...state);
    socket.broadcast.emit("player", socket.nickname, state);

    for (const oppSocket of socketsExcept(socket)) {
      const opponent = oppSocket.player;

      if (opponent.dead || (player.hasImmunity && opponent.hasImmunity)) {
        continue;
      }

      if (player.collidePlayer(opponent)) {
        if (!player.hasImmunity) {
          player.die();
          socket.emit("respawn");
        }

        if (!opponent.hasImmunity && opponent.collidePlayer(player)) {
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
    socket.broadcast.emit("respawn", socket.nickname);
    socket.immunityTimeout = setImmunityTimeout();
  });

  socket.on("disconnect", () => {
    clearTimeout(socket.immunityTimeout);
    socket.broadcast.emit("player_disconnect", socket.nickname);
  });
});

console.log("Server is running on port", port);

// Fix CORS origin
// We may need to warn players about their opponents' deaths
// Maybe we should broadcast player state after collision checks to reduce lag

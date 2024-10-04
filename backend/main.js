import { Server } from "socket.io";
import Apples from "./apples.js";
import Player from "./player.js";
import { SPAWN_PROTECTION_TIME } from "./constants.js";

const port = 3000;
const io = new Server(port, { cors: { origin: "*" } });
const apples = new Apples();

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

function killPlayer(socket) {
  const { player } = socket;
  player.die();
  socket.emit("player_respawn");

  if (player.apples) {
    apples.add(player.apples);
    socket.emit("apples_add", player.apples);
    socket.broadcast.emit("apples_add", player.apples);
  }
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

  handleConnection();
  socket.on("update", handleUpdate);
  socket.on("respawn", handleRespawn);
  socket.on("disconnect", handleDisconnect);

  function handleConnection() {
    socketsExcept(socket).forEach((oppSocket) => {
      socket.emit(
        "player_add",
        oppSocket.nickname,
        oppSocket.player.getState(),
        !oppSocket.player.protected
      );
    });
    socket.emit("apples_add", apples.getState());
    socket.broadcast.emit("player_add", socket.nickname);
    socket.protectionTimeout = setProtectionTimeout();
  }

  function handleUpdate(state) {
    if (player.dead) {
      return;
    }
    player.setState(state);
    socket.broadcast.emit("player", socket.nickname, state);

    for (const oppSocket of socketsExcept(socket)) {
      const opponent = oppSocket.player;

      if (opponent.dead) {
        continue;
      }
      if (!player.dead && !player.protected && player.collidePlayer(opponent)) {
        killPlayer(socket);
        // Don't stop the loop because another opponent may be colliding the player at the same time
        // This algorithm can change if it executes on a server update instead of a player update
      }
      if (!opponent.protected && opponent.collidePlayer(player)) {
        killPlayer(oppSocket);
      }
    }

    if (player.dead) {
      // If the player collided an opponent
      return;
    }

    if (!player.protected && player.collideItself()) {
      killPlayer(socket);
      return;
    }

    if (player.collideEdges()) {
      killPlayer(socket);
      clearTimeout(socket.protectionTimeout);
      return;
    }

    for (const [index, apple] of apples.get()) {
      if (player.collideApple(apple)) {
        // A substitute apple is returned when the last apple is removed
        const subApple = apples.remove(index);
        socket.emit("apples_remove", index, subApple, true);
        socket.broadcast.emit("apples_remove", index, subApple);
      }
    }
  }

  function handleRespawn() {
    player.reset();
    socket.broadcast.emit("player_respawn", socket.nickname);
    socket.protectionTimeout = setProtectionTimeout();
  }

  function handleDisconnect() {
    socket.broadcast.emit("player_remove", socket.nickname);
    clearTimeout(socket.protectionTimeout);
  }

  function setProtectionTimeout() {
    return setTimeout(() => {
      player.protected = false;
      socket.emit("player_protection_end");
      socket.broadcast.emit("player_protection_end", socket.nickname);
    }, 1000 * SPAWN_PROTECTION_TIME);
  }
});

console.log("Server is running on port", port);

// Fix CORS origin
// We may need to warn players about their opponents' deaths
// Maybe broadcast player apples on death, inside the same event
// Maybe we should broadcast player state after collision checks to reduce lag

import { Server } from "socket.io";
import Apples from "./apples.js";
import Player from "./player.js";
import { SPAWN_PROTECTION_TIME } from "./constants.js";

const port = 3000;
const io = new Server(port, { cors: { origin: "*" } });
const apples = new Apples();

function getSockets() {
  return Array.from(io.sockets.sockets.values());
}

function getPlayers() {
  return getSockets().map((s) => s.player);
}

function getOpponents(player) {
  return getPlayers().filter((p) => p !== player);
}

function isNicknameInUse(nickname) {
  return getPlayers().some((p) => p.nickname === nickname);
}

function killPlayer(player) {
  player.die();
  player.socket.emit("player_respawn");

  if (player.appleCount > 0) {
    apples.add(player.apples);
    player.socket.emit("apples_add", player.apples);
    player.socket.broadcast.emit("apples_add", player.apples);
  }
}

io.use((socket, next) => {
  const { nickname } = socket.handshake.auth;

  if (isNicknameInUse(nickname)) {
    next(new Error("login error"));
    return;
  }

  socket.player = new Player(socket, nickname);
  next();
});

io.on("connection", (socket) => {
  const { player } = socket;

  handleConnection();
  socket.on("update", handleUpdate);
  socket.on("respawn", handleRespawn);
  socket.on("disconnect", handleDisconnect);

  function handleConnection() {
    getOpponents(player).forEach((opponent) => {
      socket.emit("player_add", opponent.nickname, opponent.getState(), !opponent.protected);
    });
    socket.emit("apples_add", apples.getState());
    socket.broadcast.emit("player_add", player.nickname);
    socket.protectionTimeout = setProtectionTimeout();
  }

  function handleUpdate(state) {
    if (player.dead) {
      return;
    }
    player.setState(state);
    socket.broadcast.emit("player", player.nickname, state);

    for (const opponent of getOpponents(player)) {
      if (!opponent.dead && !opponent.protected && opponent.collidePlayer(player)) {
        killPlayer(opponent);
      }
    }

    if (!player.protected) {
      for (const opponent of getOpponents(player)) {
        if (player.collidePlayer(opponent)) {
          killPlayer(player);
          return;
        }
      }

      if (player.collideItself()) {
        killPlayer(player);
        return;
      }
    }

    if (player.collideEdges()) {
      killPlayer(player);
      clearTimeout(socket.protectionTimeout);
      return;
    }

    for (const [index, apple] of apples.get()) {
      if (player.collideApple(apple)) {
        // A substitute apple is returned when the last apple is removed
        const subApple = apples.remove(index);
        player.incrementAppleCount();
        socket.emit("apples_remove", index, subApple, true);
        socket.broadcast.emit("apples_remove", index, subApple);
      }
    }
  }

  function handleRespawn() {
    player.reset();
    socket.broadcast.emit("player_respawn", player.nickname);
    socket.protectionTimeout = setProtectionTimeout();
  }

  function handleDisconnect() {
    socket.broadcast.emit("player_remove", player.nickname);
    clearTimeout(socket.protectionTimeout);
  }

  function setProtectionTimeout() {
    return setTimeout(() => {
      player.protected = false;
      socket.emit("player_protection_end");
      socket.broadcast.emit("player_protection_end", player.nickname);
    }, 1000 * SPAWN_PROTECTION_TIME);
  }
});

console.log("Server is running on port", port);

// Fix CORS origin
// We may need to warn players about their opponents' deaths
// Maybe broadcast player apples on death, inside the same event

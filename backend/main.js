import { Server } from "socket.io";
import Apples from "./apples.js";
import Player from "./player.js";
import { SPAWN_PROTECTION_TIME } from "./constants.js";

const port = 3000;
const productionEnv = true;
const io = new Server(port, {
  cors: {
    origin: productionEnv
      ? "https://snakeremake.vercel.app"
      : ["http://127.0.0.1:5500", /^http:\/\/192\.168\.1\.\d:5500$/],
  },
});
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
  const { socket } = player;

  player.kill();
  apples.add(player.apples);
  socket.emit("player_die", null, player.apples);
  socket.broadcast.emit("player_die", player.nickname, player.apples);
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
    const opponents = getOpponents(player).map((opp) =>
      opp.dead ? [opp.nickname] : [opp.nickname, opp.getState(), !opp.protected]
    );
    socket.emit("initial_state", opponents, apples.getState());
    socket.broadcast.emit("player_join", player.nickname);
    socket.protectionTimeout = setProtectionTimeout();
  }

  function handleUpdate(state) {
    if (player.dead) {
      return;
    }
    player.setState(state);
    socket.broadcast.emit("player", player.nickname, state);

    for (const opponent of getOpponents(player)) {
      if (opponent.dead) {
        continue;
      }
      if (!player.dead && !player.protected && player.collidePlayer(opponent)) {
        killPlayer(player);
      }
      if (!opponent.protected && opponent.collidePlayer(player)) {
        killPlayer(opponent);
      }
    }

    if (player.dead) {
      return;
    }

    if (!player.protected && player.collideItself()) {
      killPlayer(player);
      return;
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
        socket.emit("apple_eat", index, subApple, true);
        socket.broadcast.emit("apple_eat", index, subApple);
      }
    }
  }

  function handleRespawn() {
    player.respawn();
    socket.broadcast.emit("player_respawn", player.nickname);
    socket.protectionTimeout = setProtectionTimeout();
  }

  function handleDisconnect() {
    socket.broadcast.emit("player_leave", player.nickname);
    clearTimeout(socket.protectionTimeout);
  }

  function setProtectionTimeout() {
    return setTimeout(() => {
      player.unprotect();
      socket.emit("player_unprotect");
      socket.broadcast.emit("player_unprotect", player.nickname);
    }, 1000 * SPAWN_PROTECTION_TIME);
  }
});

console.log("Server is running on port", port);

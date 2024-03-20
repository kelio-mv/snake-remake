const { Server } = require("socket.io");
const Player = require("./player");
const Apples = require("./apples");

const port = process.env.PORT || 3000;
const io = new Server(port, { cors: { origin: "*" } });
const apples = new Apples();
let lastUpdateTime = Date.now() / 1000;

function sockets() {
  return Array.from(io.of("/").sockets).map(([_, socket]) => socket);
}

function socketsExcept(socket) {
  return sockets().filter((s) => s !== socket);
}

io.use((socket, next) => {
  const { username } = socket.handshake.auth;

  if (sockets().find((_socket) => _socket.player.username === username)) {
    next(new Error("auth error"));
  } else {
    socket.player = new Player(username);
    console.log(username, "joined the game");
    next();
  }
});

io.on("connection", (socket) => {
  socket.on("get_apples", (callback) => {
    callback(apples.apples);
  });

  socket.on("update_player", (state) => {
    const { player } = socket;
    player.setState(state);
    socket.broadcast.emit("update_player", { username: player.username, ...state });

    for (const _socket of socketsExcept(socket)) {
      const opponent = _socket.player;

      for (const [index, point] of opponent.body.entries()) {
        if (player.collide(point)) {
          if (!player.protected) {
            player.protected = true;
            socket.emit("respawn");
          }
          if (index === 0 && !opponent.protected) {
            opponent.protected = true;
            _socket.emit("respawn");
          }
          return;
        }
      }
    }

    for (const apple of apples.apples) {
      if (player.collide(apple)) {
        const newApple = apples.replace(apple);
        socket.emit("replace_apple", apple, newApple, true);
        socket.broadcast.emit("replace_apple", apple, newApple);
        break;
      }
    }
  });

  socket.on("blur", () => {
    socket.player.unfocused = true;
  });

  socket.on("focus", (callback) => {
    const { player } = socket;
    player.unfocused = false;
    callback(player);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("player_disconnect", socket.player.username);
  });
});

// setInterval(() => {
//   const now = Date.now() / 1000;
//   const deltaTime = now - lastUpdateTime;

//   if (deltaTime > UPDATE_INTERVAL) {
//     players.sockets.forEach((socket) => {
//       const { player } = socket;
//       player.update(players.sockets);

//     });

//     lastUpdateTime += UPDATE_INTERVAL;
//   }
// });

console.log(`Server is running on port ${port}`);

const { Server } = require("socket.io");
const Player = require("./player");
const Apples = require("./apples");

const port = process.env.PORT || 3000;
const io = new Server(port, { cors: { origin: "*" } });
const apples = new Apples();

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
  socket.emit("add_apples", apples.get());

  socket.on("update_player", (state) => {
    const { player } = socket;
    player.setState(state);
    socket.broadcast.emit("update_player", { username: player.username, ...state });

    for (const _socket of socketsExcept(socket)) {
      const opponent = _socket.player;
      if (!opponent.body) continue;

      for (const [index, point] of opponent.body.entries()) {
        if (player.collide(point)) {
          if (!player.protected) {
            player.protected = true;
            socket.emit("respawn");

            if (player.apples) {
              apples.add(player.apples);
              io.emit("add_apples", player.apples);
            }
          }
          if (index === 0 && !opponent.protected) {
            opponent.protected = true;
            _socket.emit("respawn");

            if (opponent.apples) {
              apples.add(opponent.apples);
              io.emit("add_apples", opponent.apples);
            }
          }
          return;
        }
      }
    }

    for (const apple of apples.get()) {
      if (player.collide(apple)) {
        const newApple = apples.replace(apple);
        socket.emit("replace_apple", apple, newApple, true);
        socket.broadcast.emit("replace_apple", apple, newApple);
        break;
      }
    }
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("player_disconnect", socket.player.username);
  });
});

console.log(`Server is running on port ${port}`);

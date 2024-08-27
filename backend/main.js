const { Server } = require("socket.io");
const io = new Server(3000, { cors: { origin: "*" } });

io.use((socket, next) => {
  const { username } = socket.handshake.auth;
  console.log(username, "joined the game.");
  next();
});

io.on("connection", (socket) => {
  //
});

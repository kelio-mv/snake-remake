import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import usernameInput from "./main.js";

export default io("ws://localhost:3000", {
  autoConnect: false,
  auth: (cb) => cb({ username: usernameInput.value }),
});

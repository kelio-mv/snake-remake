import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
import nicknameInput from "./main.js";

const socket = io("wss://snake-remake.glitch.me", {
  autoConnect: false,
  auth: (cb) => cb({ nickname: nicknameInput.value }),
  transports: ["websocket"],
});

export default socket;

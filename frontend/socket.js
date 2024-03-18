import usernameInput from "./main.js";

const socket = io("wss://snake-remake.glitch.me", {
  autoConnect: false,
  auth: (cb) => cb({ username: usernameInput.value }),
  transports: ["websocket"],
});

export default socket;

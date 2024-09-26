class Sound extends Audio {
  constructor(src) {
    super(src);
  }

  play() {
    this.currentTime = 0;
    super.play();
  }
}

const sounds = {
  localPlayerEat: new Sound("sounds/local-player-eat.ogg"),
  localPlayerCollide: new Sound("sounds/local-player-collide.ogg"),
  remotePlayerEat: new Sound("sounds/remote-player-eat.ogg"),
  remotePlayerCollide: new Sound("sounds/remote-player-collide.ogg"),
};

export default sounds;

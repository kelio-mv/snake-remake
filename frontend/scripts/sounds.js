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
  playerEat: new Sound("sounds/player-eat.ogg"),
  playerCollide: new Sound("sounds/player-collide.ogg"),
};

export default sounds;

class Rect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  collideRect(rect) {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }

  collidePoint(point) {
    const [x, y] = point;
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }

  get top() {
    return this.y;
  }
  get left() {
    return this.x;
  }
  get bottom() {
    return this.y + this.height;
  }
  get right() {
    return this.x + this.width;
  }

  get topleft() {
    return [this.left, this.top];
  }
  get bottomleft() {
    return [this.left, this.bottom];
  }
  get topright() {
    return [this.right, this.top];
  }
  get bottomright() {
    return [this.right, this.bottom];
  }

  get midtop() {
    return [this.centerx, this.top];
  }
  get midleft() {
    return [this.left, this.centery];
  }
  get midbottom() {
    return [this.centerx, this.bottom];
  }
  get midright() {
    return [this.right, this.centery];
  }

  get centerx() {
    return this.x + this.width / 2;
  }
  get centery() {
    return this.y + this.height / 2;
  }
  get center() {
    return [this.centerx, this.centery];
  }

  get size() {
    return [this.width, this.height];
  }

  set top(y) {
    this.y = y;
  }
  set left(x) {
    this.x = x;
  }
  set bottom(y) {
    this.y = y - this.height;
  }
  set right(x) {
    this.x = x - this.width;
  }

  set topleft([x, y]) {
    this.left = x;
    this.top = y;
  }
  set bottomleft([x, y]) {
    this.left = x;
    this.bottom = y;
  }
  set topright([x, y]) {
    this.right = x;
    this.top = y;
  }
  set bottomright([x, y]) {
    this.right = x;
    this.bottom = y;
  }

  set midtop([x, y]) {
    this.centerx = x;
    this.top = y;
  }
  set midleft([x, y]) {
    this.left = x;
    this.centery = y;
  }
  set midbottom([x, y]) {
    this.centerx = x;
    this.bottom = y;
  }
  set midright([x, y]) {
    this.right = x;
    this.centery = y;
  }

  set centerx(x) {
    this.x = x - this.width / 2;
  }
  set centery(y) {
    this.y = y - this.height / 2;
  }
  set center([x, y]) {
    this.centerx = x;
    this.centery = y;
  }

  set size([width, height]) {
    this.width = width;
    this.height = height;
  }
}

export default Rect;

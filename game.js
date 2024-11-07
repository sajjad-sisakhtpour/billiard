BALL_ORIGIN = new Vector(25, 25);
STICK_ORIGIN = new Vector(970, 11);
SHOOT_ORIGIN = new Vector(950, 11);

//////////////load assets//////////

let sprites = {};
let assetsStillLoading = 0;

function loadSprites(fileName) {
  assetsStillLoading++;
  let spriteImage = new Image();
  spriteImage.src = "./assets/sprites/" + fileName;
  assetsStillLoading--;

  return spriteImage;
}

function loadAssets(callBack) {
  sprites.background = loadSprites("background.png");
  sprites.ball = loadSprites("ball.png");
  sprites.stick = loadSprites("stick.png");

  assetsLoadingLoop(callBack);
}

function assetsLoadingLoop(callBack) {
  if (assetsStillLoading) {
    requestAnimationFrame(assetsLoadingLoop.bind(this, callBack));
  } else {
    callBack();
  }
}

/////////////////vector///////////////////

function Vector(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}

Vector.prototype.copy = function () {
  return new Vector(this.x, this.y);
};

Vector.prototype.addTo = function (vector) {
  this.x += vector.x;
  this.y += vector.y;
};

//////////////////handling mouse/////////

function ButtonState() {
  this.down = false;
}

function MouseHandler() {
  this.position = new Vector();

  this.left = new ButtonState();
  this.middle = new ButtonState();
  this.right = new ButtonState();

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mousedown", handleMouseDown);
  document.addEventListener("mouseup", handleMouseUp);
}

function handleMouseMove(e) {
  Mouse.position.x = e.pageX;
  Mouse.position.y = e.pageY;
}

function handleMouseDown(e) {
  if ((e.which = 1)) {
    Mouse.left.down = true;
  } else if ((e.which = 2)) {
    Mouse.left.down = true;
  } else if ((e.which = 3)) {
    Mouse.left.down = true;
  }
}

function handleMouseUp(e) {
  if ((e.which = 1)) {
    Mouse.left.down = false;
  } else if ((e.which = 2)) {
    Mouse.left.down = false;
  } else if ((e.which = 3)) {
    Mouse.left.down = false;
  }
}

let Mouse = new MouseHandler();

/////////////////canvas////////////////////

function Canvas2D() {
  this._canvas = document.getElementById("screen");
  this.ctx = this._canvas.getContext("2d");
}

Canvas2D.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
};

Canvas2D.prototype.drawImage = function (
  image,
  position = new Vector(),
  origin = new Vector(),
  rotation = 0
) {
  this.ctx.save();
  this.ctx.translate(position.x, position.y);
  this.ctx.rotate(rotation);
  this.ctx.drawImage(image, -origin.x, -origin.y);
  this.ctx.restore();
};

let canvas = new Canvas2D();

////////////////////ball/////////////

function Ball() {
  this.position = new Vector(413, 413);
  this.velocity = new Vector();
}

Ball.prototype.draw = function () {
  canvas.drawImage(sprites.ball, this.position, BALL_ORIGIN);
};

Ball.prototype.update = function () {
  this.position.addTo(this.velocity);
};

Ball.prototype.shoot = function (power, rotation) {
  console.log(power, rotation);
};

////////////////////stick/////////////

function Stick(onShoot) {
  this.rotation = 0;
  this.position = new Vector(413, 413);
  this.origin = STICK_ORIGIN.copy();
  this.power = 0;
  this.onShoot = onShoot;
}

Stick.prototype.draw = function () {
  canvas.drawImage(sprites.stick, this.position, this.origin, this.rotation);
};

Stick.prototype.update = function () {
  this.updateRotation();

  if (Mouse.left.down) {
    this.increasePower();
  } else if (this.power > 5) {
    this.shoot();
  }
};

Stick.prototype.updateRotation = function () {
  let oposite = Mouse.position.y - this.position.y;
  let adjacent = Mouse.position.x - this.position.x;

  this.rotation = Math.atan2(oposite, adjacent);
};

Stick.prototype.increasePower = function () {
  this.origin.x += 5;
  this.power += 100;
};

Stick.prototype.shoot = function () {
  this.onShoot(this.power, this.rotation);
  this.origin = SHOOT_ORIGIN.copy();
  this.power = 0;
};

//////////////////game world//////////////////

function GameWorld() {
  this.whiteBall = new Ball();
  this.stick = new Stick(this.whiteBall.shoot.bind(this.whiteBall));
}

GameWorld.prototype.draw = function () {
  canvas.drawImage(sprites.background);
  this.whiteBall.draw();
  this.stick.draw();
};

GameWorld.prototype.update = function () {
  this.stick.update();
};

let gameWorld = new GameWorld();

/////////////////////// animation///////////////

function animate() {
  canvas.clear();
  gameWorld.draw();
  gameWorld.update();
  requestAnimationFrame(animate);
}

loadAssets(animate);

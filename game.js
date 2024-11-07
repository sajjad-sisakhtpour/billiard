BALL_ORIGIN = new Vector(25, 25);
STICK_ORIGIN = new Vector(970, 11);

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

//////////////////handling mouse/////////

function MouseHandler() {
  this.left = new Vector();
}

document.addEventListener("mousemove", function handleMouseMove(e) {
  Mouse.left.x = e.pageX;
  Mouse.left.y = e.pageY;
});

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

function Ball() {}

Ball.prototype.draw = function () {
  canvas.drawImage(sprites.ball, new Vector(413, 413), BALL_ORIGIN);
};

Ball.prototype.update = function () {};

////////////////////stick/////////////

function Stick() {
  this.rotation = 0;
  this.position = new Vector(413, 413);
}

Stick.prototype.draw = function () {
  canvas.drawImage(sprites.stick, this.position, STICK_ORIGIN, this.rotation);
};

Stick.prototype.update = function () {
  this.updateRotation();
};

Stick.prototype.updateRotation = function () {
  let oposite = Mouse.left.y - this.position.y;
  let adjacent = Mouse.left.x - this.position.x;

  this.rotation = Math.atan2(oposite, adjacent);
};

//////////////////game world//////////////////

function GameWorld() {
  this.whiteBall = new Ball();
  this.stick = new Stick();
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

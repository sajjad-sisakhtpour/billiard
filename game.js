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

  if (assetsStillLoading) {
    requestAnimationFrame(loadAssets.bind(this, callBack));
  } else {
    callBack();
  }
}

/////////////////vector///////////////////

function Vector(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}

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

//////////////////game world//////////////////

function GameWorld() {}

GameWorld.prototype.draw = function () {
  canvas.drawImage(sprites.background);
};

GameWorld.prototype.update = function () {};

let gameWorld = new GameWorld();

/////////////////////// animation///////////////

function animate() {
  canvas.clear();
  gameWorld.draw();
  gameWorld.update();
  requestAnimationFrame(animate);
}

loadAssets(animate);

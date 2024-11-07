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
  x = 0,
  y = 0,
  dx = 0,
  dy = 0,
  rotation = 0
) {
  this.ctx.save();
  this.ctx.translate(x, y);
  this.ctx.rotate(rotation);
  this.ctx.drawImage(image, dx, dy);
  this.ctx.restore();
};

let canvas = new Canvas2D();

//////////////////////////////////////

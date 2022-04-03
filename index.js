const canvas = document.querySelector("canvas");
const canvas2dContext = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 768;

canvas2dContext.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {
  constructor(position) {
    this.position = position;
  }

  generateSprite() {
    canvas2dContext.fillStyle = "red";
    canvas2dContext.fillRect(this.position.x, this.position.y, 50, 150);
  }
}

const player = new Sprite({ x: 0, y: 0 });
player.generateSprite();

const enemy = new Sprite({ x: 400, y: 100 });
enemy.generateSprite();

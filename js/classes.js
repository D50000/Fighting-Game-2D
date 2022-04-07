class Sprite {
  // Just handle the basic animation render.
  constructor({
    position,
    offset = { x: 0, y: 0 },
    imageSrc,
    scale = 1,
    totalFrames = 1,
  }) {
    this.position = position;
    this.height = 150;
    this.width = 50;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.totalFrames = totalFrames;
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    canvas2dContext.drawImage(
      this.image,
      this.currentFrame * (this.image.width / this.totalFrames),
      0,
      this.image.width / this.totalFrames,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.totalFrames) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    // Render image frame from left to right
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.totalFrames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    offset = { x: 0, y: 0 },
    imageSrc,
    scale = 1,
    totalFrames = 1,
  }) {
    console.log(imageSrc);
    // Call the constructor of the parent class
    super({
      position,
      offset,
      imageSrc,
      scale,
      totalFrames,
    });

    this.velocity = velocity;
    this.color = color;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.isAttacking = false;
    this.health = 100;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
  }

  // generateSprite() {
  //   // character
  //   canvas2dContext.fillStyle = this.color;
  //   canvas2dContext.fillRect(
  //     this.position.x,
  //     this.position.y,
  //     this.width,
  //     this.height
  //   );
  //   // attack box
  //   if (this.isAttacking) {
  //     canvas2dContext.fillStyle = "green";
  //     canvas2dContext.fillRect(
  //       this.attackBox.position.x,
  //       this.attackBox.position.y,
  //       this.attackBox.width,
  //       this.attackBox.height
  //     );
  //   }
  // }

  update() {
    this.draw();
    this.animateFrames();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

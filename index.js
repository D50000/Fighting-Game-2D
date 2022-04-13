const canvas = document.querySelector("canvas");
canvas.width = 1366;
canvas.height = 768;

const canvas2dContext = canvas.getContext("2d");
canvas2dContext.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./image/Hills.png",
});
const castle = new Sprite({
  position: {
    x: 1215,
    y: 540,
  },
  imageSrc: "./image/castle.png",
  totalFrames: 1,
});

const player = new Fighter({
  position: {
    x: 30,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 150,
    y: 90,
  },
  imageSrc: "./image/player1/Idle.png",
  totalFrames: 11,
  scale: 2,
  sprites: {
    idle: {
      imageSrc: "./image/player1/Idle.png",
      totalFrames: 11,
    },
    run: {
      imageSrc: "./image/player1/Run.png",
      totalFrames: 8,
    },
    jump: {
      imageSrc: "./image/player1/Jump.png",
      totalFrames: 3,
    },
    fall: {
      imageSrc: "./image/player1/Fall.png",
      totalFrames: 3,
    },
    attack: {
      imageSrc: "./image/player1/Attack2.png",
      totalFrames: 7,
    },
    takeHit: {
      imageSrc: "./image/player1/Take Hit.png",
      totalFrames: 4,
    },
    death: {
      imageSrc: "./image/player1/Death.png",
      totalFrames: 11,
    },
  },
  attackBox: {
    offset: {
      x: 60,
      y: 30,
    },
    width: 130,
    height: 80,
  },
});
player.draw();

const enemy = new Fighter({
  position: {
    x: 1200,
    y: 500,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 150,
    y: 80,
  },
  imageSrc: "./image/player2/Idle.png",
  totalFrames: 10,
  scale: 2.2,
  sprites: {
    idle: {
      imageSrc: "./image/player2/Idle.png",
      totalFrames: 10,
    },
    run: {
      imageSrc: "./image/player2/Run.png",
      totalFrames: 8,
    },
    jump: {
      imageSrc: "./image/player2/Jump.png",
      totalFrames: 3,
    },
    fall: {
      imageSrc: "./image/player2/Fall.png",
      totalFrames: 3,
    },
    attack: {
      imageSrc: "./image/player2/Attack3.png",
      totalFrames: 8,
    },
    takeHit: {
      imageSrc: "./image/player2/Take hit.png",
      totalFrames: 3,
    },
    death: {
      imageSrc: "./image/player2/Death.png",
      totalFrames: 7,
    },
  },
  attackBox: {
    offset: {
      x: -140,
      y: 30,
    },
    width: 130,
    height: 80,
  },
});
enemy.draw();

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

function rectangularCollision({ rectangule1, rectangule2 }) {
  return (
    rectangule1.attackBox.position.x + rectangule1.attackBox.width >=
      rectangule2.position.x &&
    rectangule1.attackBox.position.x <=
      rectangule2.position.x + rectangule2.width &&
    rectangule1.attackBox.position.y + rectangule1.attackBox.height >=
      rectangule2.position.y &&
    rectangule1.attackBox.position.y <=
      rectangule2.position.y + rectangule2.height
  );
}

function determineWinner({ player, enemy, startCountDown }) {
  clearInterval(startCountDown);
  document.querySelector(".dialog").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector(".dialog").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector(".dialog").innerHTML = "Play 1 Wins";
  } else if (player.health < enemy.health) {
    document.querySelector(".dialog").innerHTML = "Play 2 Wins";
  }
}

let timmer = 100;
const startCountDown = setInterval(() => {
  if (timmer > 0) {
    timmer--;
    document.querySelector(".timer").innerHTML = timmer;
  }
  if (timmer === 0) {
    determineWinner({ player, enemy, startCountDown });
  }
}, 1000);

function animate() {
  window.requestAnimationFrame(animate);
  canvas2dContext.fillStyle = "black";
  canvas2dContext.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  castle.update();
  // Let background be more transparent.
  canvas2dContext.fillStyle = "rgba(255, 255, 255, 0.1)";
  canvas2dContext.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  // player movement
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  // jumping up to down
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }
  // enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  // jumping up to down
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect for attack collision
  if (
    rectangularCollision({ rectangule1: player, rectangule2: enemy }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    player.isAttacking = false; // one attack per count
    console.log("1 hit 2");
    enemy.takeHit();
    // document.querySelector(
    //   "div.player2 > .health"
    // ).style.width = `${enemy.health}%`;
    gsap.to("div.player2 > .health", {
      width: enemy.health + "%",
    });
  }
  // play attack miss
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }
  if (
    rectangularCollision({ rectangule1: enemy, rectangule2: player }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 4
  ) {
    enemy.isAttacking = false; // one attack per count
    console.log("2 hit 1");
    player.takeHit();
    // document.querySelector(
    //   "div.player1 > .health"
    // ).style.width = `${player.health}%`;
    gsap.to("div.player1 > .health", {
      width: player.health + "%",
    });
  }
  // enemy attack miss
  if (enemy.isAttacking && enemy.currentFrame === 4) {
    enemy.isAttacking = false;
  }

  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, startCountDown });
  }
}
animate();

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  // player movement
  if (!player.dead) {
    switch (event.key) {
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }

  // enemy movement
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // player movement
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    // enemy movement
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});

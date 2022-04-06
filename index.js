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
const testItem = new Sprite({
  position: {
    x: 1215,
    y: 540,
  },
  imageSrc: "./image/castle.png",
  totalFrames: 1,
});
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

player.generateSprite();
console.log(`generateSprite ${player}`);

const enemy = new Fighter({
  position: {
    x: 400,
    y: 400,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});
enemy.generateSprite();

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

let timmer = 10;
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
  // console.log("requestAnimationFrame");
  canvas2dContext.fillStyle = "black";
  canvas2dContext.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  testItem.update();
  player.update();
  enemy.update();

  // player movement
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }
  // enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //detect for attack collision
  if (
    rectangularCollision({ rectangule1: player, rectangule2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false; // one attack per count
    console.log("1 hit 2");
    enemy.health -= 20;
    document.querySelector(
      "div.player2 > .health"
    ).style.width = `${enemy.health}%`;
  }
  if (
    rectangularCollision({ rectangule1: enemy, rectangule2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false; // one attack per count
    console.log("2 hit 1");
    player.health -= 20;
    document.querySelector(
      "div.player1 > .health"
    ).style.width = `${player.health}%`;
  }
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, startCountDown });
  }
}
animate();

window.addEventListener("keydown", (event) => {
  console.log(event.key);
  switch (event.key) {
    // player movement
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
    // enemy movement
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

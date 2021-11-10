const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Mouse = Matter.Mouse;
const Constraint = Matter.Constraint;
const MouseConstraint = Matter.MouseConstraint;

var engine, world;
var bgImg, coinImg;
var player;
var gameState = "initial";
var lives = 3;
var coinsCount = 0;
var score = 0;
var rope;
var invisibleUpperWall;
var p1Img, p2Img, p3Img;

var bgPosX = 425;
var bgPosY = 235;
var highScore = 900;

var points = [
  { x: 400, y: 200, isAttached: true },
  { x: 600, y: 50, isAttached: false },
  { x: 650, y: 300, isAttached: false },
  { x: 800, y: 180, isAttached: false }
];

var coins = [
  { x: 650, y: 200 },
  { x: 700, y: 50 }
];
var song;
var gameOverSound;
function preload() {
  bgImg = loadImage("./assets/background.png");
  coinImg = loadImage("./assets/coins.png");
  p1Img = loadImage("./assets/box1.png");
  p2Img = loadImage("./assets/box2.png");
  p3Img = loadImage("./assets/box3.png");
  song = loadSound("./assets/children-games.mp3");
  gameOverSound = loadSound("./assets/sad-trombone.mp3");
}

function setup() {
  createCanvas(950, 470);
  engine = Engine.create();
  world = engine.world;

  player = new Box(100, 200, 30, 30, p1Img);
  invisibleUpperWall = new Box(425, 15, 1050, 10);
  Body.setStatic(invisibleUpperWall.body, true);

  rope = new Sling(points[0], player.body);

  var mouse = Mouse.create(canvas.elt);
  let options = {
    mouse: mouse
  };
  var mConstraint = MouseConstraint.create(engine, options);
  World.add(world, mConstraint);
}

function draw() {
  background(bgImg);

  Engine.update(engine);
  if (gameState === "play") {
    resetBackground();
  }

  if (gameState === "initial") {
    textSize(20);
    fill("white");
    text("SLING TO START", 325, 150);
    if (mouseIsPressed) {
      gameState = "play";
      song.setVolume(0.1);
      song.play();
    }
  }

  rope.display();
  player.displayWithImage();

  handlePoints();

  handleCoins();

  addPointsAndCoins();

  if (lives === 0) {
    gameState = "end";
    song.stop();
    gameOverSound.play();
    gameOverSound.setVolume(0.2);
  }

  if (player.body.position.y > 500 && lives > 0) {
    lives -= 1;
    points[0].isAttached = true;
    rope.attach(points[0], player.body);
  }

  if (gameState === "end") {
    restartGame();
  }

  scoreBoard();

  if (score >= highScore) {
    gameState = "win";
  }

  if (gameState === "win") {
    player.changeImage(p3Img);
    textSize(20);
    fill("white");
    text("YOU WIN!", 325, 130);
    textSize(17);
    text("Refresh the page to replay", 270, 160);
  }
}

function mouseReleased() {
  setTimeout(() => {
    rope.fly();
  }, 70);
}

function drawPoints(i) {
  push();
  stroke("#fff9c4");
  strokeWeight(3);
  ellipseMode(RADIUS);
  fill("#4527a0");
  ellipse(points[i].x, points[i].y, 10, 10);
  pop();
}

function drawCoins(i) {
  push();
  imageMode(CENTER);
  image(coinImg, coins[i].x, coins[i].y, 30, 30);
  pop();
}

function scoreBoard() {
  textSize(17);
  text("Coins: " + coinsCount, 30, 45);
  text("Lives: " + lives, 130, 45);
  text("Score: " + score, 230, 45);
  text("High Score: " + highScore, 110, 75);
}

function addPointsAndCoins() {
  if (points.length < 5) {
    points.push({
      x: random(800, 1150),
      y: random(80, 300),
      isAttached: false
    });
  }

  if (coins.length < 4) {
    coins.push({
      x: random(800, 1300),
      y: random(50, 300)
    });
  }
}

function restartGame() {
  textSize(20);
  text("GAME OVER", 400, 130);
  textSize(16);
  text("Press space to restart the game", 350, 160);

  player.changeImage(p2Img);

  points = [
    { x: 400, y: 200, isAttached: true },
    { x: 600, y: 50, isAttached: false },
    { x: 650, y: 300, isAttached: false },
    { x: 800, y: 180, isAttached: false }
  ];

  coins = [
    { x: 650, y: 200 },
    { x: 700, y: 50 }
  ];

  lives = 3;
  score = 0;
  coinsCount = 0;

  rope.attach(points[0], player.body);

  // Changing game state to initial
  if (keyIsDown(32)) {
    gameState = "initial";
    player.changeImage(p1Img);
  }
}

function handlePoints() {
  for (let i = 0; i < points.length; i++) {
    drawPoints(i);

    if (gameState === "play") {
      // Move the points
      points[i].x -= 0.3;
    }

    var collided = player.overlap(points[i].x, points[i].y, 20, 20);

    if (collided && !points[i].isAttached) {
      for (var j = 0; j < points.length; j++) {
        if (points[j].isAttached) {
          points[j].isAttached = false;
        }
      }
      points[i].isAttached = true;
      rope.attach(points[i], player.body);
      score += 13;
    }

    if (points[i].x < 60) {
      if (points[i].isAttached) {
        rope.fly();
      }
      points.shift();
    }
  }
}

function handleCoins() {
  for (let i = 0; i < coins.length; i++) {
    drawCoins(i);
    if (gameState === "play") {
      // Move the Coins
      coins[i].x -= 0.3;
    }

    var coinCollected = player.overlap(coins[i].x, coins[i].y, 30, 30);

    if (coins[i].x < 60) {
      coins.shift();
    }
    if (coinCollected) {
      coins.splice(i, 1);
      coinsCount += 1;
      score += 29;
    }
  }
}

function resetBackground() {
  push();
  imageMode(CENTER);
  image(bgImg, bgPosX, bgPosY, 1900, 470);
  pop();
  bgPosX -= 0.3;

  if (bgPosX < 0) {
    bgPosX = 425;
  }
}

// game variables
gameStarted = false;
fontSize = 25;
// canvas variables
canvasHeight = 1080;
canvasWidth = 1080;
// background variables
backgroundY1 = 0;
backgroundY2 = -canvasHeight;
backgroundSpeed = 3;
//border
borderWidth = 50

class Borders{
  constructor(){
    this.color = '#6f7480';
    this.width = borderWidth;
  }
  draw(){
    fill(this.color); // setup color
    // left border
    noStroke();
    rect(0, 0, this.width, canvasHeight);
    // top border
    rect(0, 0, canvasWidth, this.width);
    // right border
    rect(canvasWidth - this.width, 0, this.width, canvasHeight);
  }
}

class ScoreBoard{
  constructor(){
    this.boardColor = '#00ffff';
    this.bounceCount = 0;
    this.ufoCount = 0;
    this.x = borderWidth;
    this.y = 40;
  }
  draw(){
    fill(this.boardColor); // setup color
    textAlign(LEFT);
    text(`Bounces: ${this.bounceCount} UFOs: ${this.ufoCount}`, this.x, this.y)
  }
}

class Paddle{
  constructor(){
    // paddle variables
    this.color = '#00ffff';
    this.width = 40;
    this.length = 150;
    this.x = (canvasWidth / 2) - (this.length / 2); // center paddle
    this.y = canvasHeight - this.width;
    this.speed = 30;
    // paddle borders
    this.top = canvasHeight - this.width;
    this.bottom = canvasHeight;
    this.right = this.x + this.length;
    this.left = this.x;
  }
  draw() {
    fill(this.color); // setup color
    rect(this.x, this.y, this.length, paddle.width);
  }
  animate() {
    // move left
    if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && (this.x > borderWidth)) {
      this.x -= this.speed;
    }
    if (this.x <= borderWidth) { // dont let paddle leave to the left
      this.x = borderWidth;
    }
    // move right
    if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && (this.x < (canvasWidth - paddle.length - borderWidth))) {
      this.x += this.speed;
    }
    if (this.x >= (canvasWidth - this.length - borderWidth)) { // dont let paddle leave to the right
      this.x = (canvasWidth -this.length - borderWidth);
    }
  }
  restart() {
    this.x = (canvasWidth / 2) - (this.length / 2); // center paddle
    paddle.animate();
  }
}

class Ball{
  constructor(){
    this.radius = 30;
    this.x = (canvasWidth / 2);
    this.y = (canvasHeight / 2);
    this.slowestSpeed = 4;
    this.fastestSpeed = 10;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.colorSpeed = 6;
    this.red = 255;
    this.green = 0;
    this.blue = 0;
    this.redSpeed = 0;
    this.blueSpeed = 0;
    this.greenSpeed = this.colorSpeed;
    this.top = this.y - (this.radius / 2);
    this.bottom = this.y + (this.radius / 2);
    this.right = this.x + (this.radius / 2);
    this.left = this.x - (this.radius / 2);
  }
  draw(){
    fill(this.red,this.green, this.blue);// setup color
    ellipse(this.x, this.y, this.radius);
  }
  setupSpeed(){
    let positiveOrNegX = int(random(0, 2));
    let positiveOrNegY = int(random(0, 2));
    // decide if the speed of x will be positive or neg
    let xSpeedValue = random(this.slowestSpeed, this.fastestSpeed);
    // decide if the speed of y will be positive or neg
    let ySpeedValue = random(this.slowestSpeed, this.fastestSpeed);
    // give the ball speed
    (positiveOrNegX == 1) ? this.xSpeed = xSpeedValue : this.xSpeed = -xSpeedValue;
    (positiveOrNegY == 1) ? this.ySpeed = ySpeedValue : this.ySpeed = -ySpeedValue;
  }
  animateColor(){
    // color changing effect
    if (this.red >= 255 && this.green >= 255 && this.blue <= 0) { // yellow reached
      this.redSpeed = -this.colorSpeed;
      this.greenSpeed = 0;
    }
    if (this.red <= 0 && this.green >= 255 && this.blue <= 0) { // green reached
      this.blueSpeed = this.colorSpeed;
      this.redSpeed = 0;
    }
    if (this.red <= 0 && this.green >= 255 && this.blue >= 255) { // light blue reached
      this.greenSpeed = -this.colorSpeed;
      this.blueSpeed = 0;
    }
    if (this.red <= 0 && this.green <= 0 && this.blue >= 255) { // dark blue reached
      this.redSpeed = this.colorSpeed;
      this.greenSpeed = 0;
    }
    if (this.red >= 255 && this.green <= 0 && this.blue >= 255) { // hot pink reached
      this.blueSpeed = -this.colorSpeed;
      this.redSpeed = 0;
    }
    if (this.red >= 255 && this.green <= 0 && this.blue <= 0) { // red reached
      this.greenSpeed = this.colorSpeed;
      this.blueSpeed = 0;
    }
    this.red += this.redSpeed;
    this.green += this.greenSpeed;
    this.blue += this.blueSpeed;
  }
  animate(){
    // ball borders
    this.top = this.y - (this.radius / 2);
    this.bottom = this.y + (this.radius / 2);
    this.right = this.x + (this.radius / 2);
    this.left = this.x - (this.radius / 2);

    if (this.right >= (canvasWidth - borderWidth)) { // ball hit right border
      this.xSpeed = -this.xSpeed; // change direction
      this.x = canvasWidth - borderWidth - (this.radius / 2);
    }
    if (this.left <= borderWidth) { // ball hit left border
      this.xSpeed = -this.xSpeed; // change direction
      this.x = borderWidth + (this.radius / 2);
    }
    if (this.top <= borderWidth) { // ball hit top border
      this.ySpeed = -this.ySpeed; // change direction
      this.y = borderWidth + (this.radius / 2);
    }
    if (this.top >= paddle.top) { // game ends
      gameOver.play();
      gameLost();
    }
    // if ball hits paddle
    if (this.isHit()) {
      this.y = paddle.top-this.radius-5;
      scoreboard.bounceCount += 1;
      ballBounce.play();
      let oballXspeed = this.xSpeed;// original x speed
      let paddleMiddle = paddle.x + (paddle.length / 2);
      let distanceFromMiddleOfPaddle = Math.abs(paddleMiddle - this.x);
      let absValueXspeed = map(distanceFromMiddleOfPaddle, 0, (paddle.length / 2) + 1, this.slowestSpeed, this.fastestSpeed);
      (oballXspeed > 0) ? this.xSpeed = absValueXspeed : this.xSpeed = -absValueXspeed;
      this.ySpeed = -this.ySpeed; // change direction
    }
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
  isHit(){
    // paddle borders
    paddle.top = canvasHeight - paddle.width;
    paddle.bottom = canvasHeight;
    paddle.right = paddle.x + paddle.length;
    paddle.left = paddle.x;
    let higherThanBox = this.bottom < paddle.top;
    let lowerThanBox = this.top > paddle.bottom;
    let leftOfBox = this.right < paddle.left;
    let rightOfBox = paddle.right < this.left;
    // detect collision
    if (!higherThanBox && !lowerThanBox && !leftOfBox && !rightOfBox) {
      return true;
    }
    return false;
  }
  restart(){
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.x = (canvasWidth / 2);
    this.y = (canvasHeight / 2);
    ball.animate();
  }
}

class Villain{
  constructor(){
    this.x = -800;
    this.y = -800;
    this.width = 150;
    this.height = 150;
    this.centerXOffset = (this.width / 2);
    this.centerYOffset = (this.height / 2)
    this.minDistanceFromBottom = 200;
    this.maxY = (canvasHeight - this.minDistanceFromBottom- 150);
  }
  draw(){
    image(villainImage, this.x, this.y, this.width, this.height);
    this.isHit();
  }
  isHit(){
    // get center coordinates of villain
    let centerX = this.x + this.centerXOffset;
    let centerY = this.y + this.centerYOffset;
    let distance = dist(ball.x, ball.y, centerX, centerY);
    // if distance is less than both radius combined
    if (distance < ball.radius + this.centerYOffset) { // ball hit villain
      this.animate();
      shipCaught.play();
      scoreboard.ufoCount += 1;
    }
  }
  animate(){
    this.x = random(borderWidth, canvasWidth - borderWidth - villain.width);
    this.y = random(borderWidth, this.maxY);
  }
  restart(){
    this.x = -800;
    this.y = -800; // hide villain while game has not started
  }
}

function preload() {
  backgroundImage = loadImage('assets/starfield.png');
  villainImage = loadImage('assets/ufo.png');
  ballBounce = loadSound('assets/space_bounce.wav');
  shipCaught = loadSound('assets/ship_caught.wav');
  gameOver = loadSound('assets/game_over.wav');
}

function setup() { // setup game
  const canvas = createCanvas(canvasWidth, canvasHeight); // init canvas
  background(0, 255, 255); // set default background color
  textSize(fontSize); // setup font size
  villain = new Villain();
  ball = new Ball();
  paddle = new Paddle();
  scoreboard = new ScoreBoard();
  borders = new Borders();
}

function gameLost() {
  gameStarted = false;
  paddle.restart();
  ball.restart();
  villain.restart()
}

function mousePressed() {
  if (!gameStarted) { // start game
    ball.setupSpeed();
    villain.animate();
    scoreboard.bounceCount = 0;
    scoreboard.ufoCount = 0;
    gameStarted = true;
  }
}

function draw() { // game loop
  if (backgroundY1 > canvasHeight) { // bring background1 back to top
    backgroundY1 = 0;
  }
  if (backgroundY2 > 0) { // bring background2 back to top
    backgroundY2 = -canvasHeight;
  }
  // draw backgrounds
  image(backgroundImage, 0, backgroundY1, canvasWidth, canvasHeight);
  image(backgroundImage, 0, backgroundY2, canvasWidth, canvasHeight);
  // move backgrounds down to animate them
  backgroundY1 += backgroundSpeed;
  backgroundY2 += backgroundSpeed;
  // draw borders
  borders.draw();
  // create game objects
  scoreboard.draw(scoreboard.bounceCount, scoreboard.ufoCount);
  villain.draw(villainImage);
  paddle.draw();
  ball.draw();

  // animation
  ball.animateColor();
  if (gameStarted) {
    paddle.animate();
    ball.animate();
  } else {
    textAlign(CENTER);
    text('Click to Begin', canvasWidth / 2, (canvasHeight / 2) - ball.radius);
  }
}

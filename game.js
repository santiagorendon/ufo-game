//game variables
gameStarted = false;
fontSize = 25;
//canvas variables
canvasHeight= 1050;
canvasWidth = 1000;
//backgound variables
backgroundY1 = 0;
backgroundY2 = -canvasHeight;
backgroundSpeed = 3;
//border variables
borderColor = "#6f7480";
borderWidth = 50;
//score variables
scoreBoardColor = "#00ffff"
bounceCount = 0;
ufoCount = 0;
scoreX = borderWidth;
scoreY = 40;
//paddle variables
paddleColor = "#00ffff"
paddleWidth = 40;
paddleLength = 150;
paddleXcoord = (canvasWidth/2)-(paddleLength/2); //center paddle
paddleYcoord = canvasHeight-paddleWidth;
paddleSpeed = 30;
//paddle boarders
paddleTop = canvasHeight-paddleWidth;
paddleBottom = canvasHeight;
paddleRight = paddleXcoord + paddleLength;
paddleLeft = paddleXcoord;
//ball variables
ballRadius = 30;
ballX = (canvasWidth/2);
ballY = (canvasHeight/2);
ballSlowestSpeed = 4;
ballFastestSpeed = 10;
ballXSpeed = 0;
ballYSpeed = 0;
ballColorSpeed = 6;
ballRed = 255;
ballGreen = 0;
ballBlue = 0;
ballRedSpeed = 0;
ballBlueSpeed = 0;
ballGreenSpeed = ballColorSpeed;
//ball borders
ballTop = ballY-(ballRadius/2);
ballBottom = ballY+(ballRadius/2);
ballRight = ballX+(ballRadius/2)
ballLeft = ballX-(ballRadius/2)
//villain variables
villainX = -800;
villainY = -800; //hide villain while game has not started
villainWidth = 200;
villainHeight = 200;
villainCenterXOffset = (villainWidth/2)
villainCenterYOffset = (villainHeight/2)
villainMinDistanceFromBottom = 200
villainMaxY = (canvasHeight-villainMinDistanceFromBottom-villainHeight);
function preload(){
  backgroundImage = loadImage('assets/starfield.png');
  villain = loadImage('assets/ufo.png');
  ballBounce = loadSound("assets/space_bounce.wav");
  shipCaught = loadSound("assets/ship_caught.wav");
  gameOver = loadSound("assets/game_over.wav");
}

function setup() { //setup game
  let canvas = createCanvas(canvasWidth, canvasHeight); //init canvas
  background(0, 255, 255); //set default background color
  textSize(fontSize); //setup font size
}
function drawBorders(){
  fill(borderColor); //setup color
  //left border
  noStroke()
  rect(0, 0, borderWidth, canvasHeight);
  //top border
  rect(0, 0, canvasWidth, borderWidth);
  //right border
  rect(canvasWidth-borderWidth, 0, borderWidth, canvasHeight);
}

function drawScoreBoard(bounces, ufos){ //draw or change score
  fill(scoreBoardColor); //setup color
  textAlign(LEFT);
  text(`Bounces: ${bounces} UFOs: ${ufos}`, scoreX, scoreY);
}

function drawPaddle(xCoord){
  fill(paddleColor); //setup color
  rect(xCoord, paddleYcoord, paddleLength, paddleWidth);
}

function drawBall(xCoord, yCoord){
  fill(ballRed, ballGreen, ballBlue)//setup color
  ellipse(xCoord, yCoord, ballRadius);
}

function animateBallColor(){
  //color changing effect
  if(ballRed >= 255 && ballGreen >= 255 && ballBlue <= 0){ //yellow reached
    ballRedSpeed= -ballColorSpeed;
    ballGreenSpeed = 0;
  }
  if(ballRed <= 0 && ballGreen >= 255 && ballBlue <= 0){ //green reached
    ballBlueSpeed = ballColorSpeed;
    ballRedSpeed = 0;
  }
  if(ballRed <= 0 && ballGreen >= 255 && ballBlue >= 255){//light blue reached
    ballGreenSpeed = -ballColorSpeed;
    ballBlueSpeed = 0;
  }
  if(ballRed <= 0 && ballGreen <= 0 && ballBlue >= 255){//dark blue reached
    ballRedSpeed = ballColorSpeed;
    ballGreenSpeed = 0;
  }
  if(ballRed >= 255 && ballGreen <= 0 && ballBlue >= 255){//hot pink reached
    ballBlueSpeed = -ballColorSpeed;
    ballRedSpeed = 0;
  }
  if(ballRed >= 255 && ballGreen <= 0 && ballBlue <= 0){ //red reached
    ballGreenSpeed = ballColorSpeed;
    ballBlueSpeed = 0;
  }
  ballRed += ballRedSpeed;
  ballGreen += ballGreenSpeed;
  ballBlue += ballBlueSpeed;
}

function animatePaddle(){
  //move left
  if ((keyIsDown(LEFT_ARROW) || keyIsDown(65)) && (paddleXcoord > borderWidth)) {
    paddleXcoord -= paddleSpeed;
  }
  if(paddleXcoord <= borderWidth){ //dont let paddle leave to the left
    paddleXcoord = borderWidth;
  }
  // move right
  if ((keyIsDown(RIGHT_ARROW) || keyIsDown(68)) && (paddleXcoord < (canvasWidth-paddleLength-borderWidth) )) {
    paddleXcoord += paddleSpeed;;
  }
  if(paddleXcoord >= (canvasWidth-paddleLength-borderWidth)){ //dont let paddle leave to the right
    paddleXcoord = (canvasWidth-paddleLength-borderWidth);
  }
}
function calculateNewBallSpeed(){

}
function ballHit(){
  //paddle boarders
  paddleTop = canvasHeight-paddleWidth;
  paddleBottom = canvasHeight;
  paddleRight = paddleXcoord + paddleLength;
  paddleLeft = paddleXcoord;

  higherThanBox = ballBottom < paddleTop;
  lowerThanBox = ballTop > paddleBottom;
  leftOfBox = ballRight < paddleLeft;
  rightOfBox = paddleRight < ballLeft;
  //detect collision
  if(!higherThanBox && !lowerThanBox && !leftOfBox && !rightOfBox){
    return true;
  }
  return false;
}

function restartPaddle(){
  paddleXcoord = (canvasWidth/2)-(paddleLength/2); //center paddle
  animatePaddle();
}

function restartBall(){
  ballXSpeed = 0;
  ballYSpeed = 0;
  ballX = (canvasWidth/2);
  ballY = (canvasHeight/2);
  animateBall();
}

function gameLost(){
  gameStarted = false;
  restartPaddle();
  restartBall();
}
function animateBall(){
  //ball borders
  ballTop = ballY-(ballRadius/2);
  ballBottom = ballY+(ballRadius/2);
  ballRight = ballX+(ballRadius/2)
  ballLeft = ballX-(ballRadius/2)

  if(ballRight >= (canvasWidth-borderWidth)){ //ball hit right border
    ballXSpeed = -ballXSpeed; //change direction
    ballX = canvasWidth-borderWidth-(ballRadius/2)
  }
  if(ballLeft <= borderWidth){ //ball hit left border
    ballXSpeed = -ballXSpeed; //change direction
    ballX = borderWidth+(ballRadius/2);
  }
  if(ballTop <= borderWidth){ //ball hit top border
    ballYSpeed = -ballYSpeed; //change direction
    ballY = borderWidth+(ballRadius/2);
  }
  if(ballTop >= paddleTop){ //game ends
    gameOver.play()
    gameLost();
  }
  //if ball hits paddle
  if(ballHit()){
    bounceCount += 1;
    ballBounce.play();
    oballXspeed = ballXSpeed//original x speed
    paddleMiddle = paddleXcoord + (paddleLength/2);
    distanceFromMiddleOfPaddle = Math.abs(paddleMiddle - ballX);

    absValueXspeed = map(distanceFromMiddleOfPaddle, 0, (paddleLength/2)+1, ballSlowestSpeed, ballFastestSpeed);
    console.log(oballXspeed);
    (oballXspeed > 0) ? ballXSpeed = absValueXspeed: ballXSpeed = -absValueXspeed;
    ballYSpeed = -ballYSpeed; //change direction
  }
  ballX += ballXSpeed;
  ballY += ballYSpeed;
}


function setupBallSpeed(){
  // ballXSpeed = 0;
  // ballYSpeed = 2;
  positiveOrNegX = int(random(0, 2));
  positiveOrNegY = int(random(0, 2));
  //decide if the speed of x will be positive or neg
  xSpeedValue = random(ballSlowestSpeed, ballFastestSpeed);
  //decide if the speed of y will be positive or neg
  ySpeedValue = random(ballSlowestSpeed, ballFastestSpeed);
  //give the ball speed
  (positiveOrNegX == 1) ? ballXSpeed = xSpeedValue : ballXSpeed = -xSpeedValue;
  (positiveOrNegY == 1) ? ballYSpeed = ySpeedValue : ballYSpeed = -ySpeedValue;
}

function mousePressed() {
  if(!gameStarted){ //start game
    setupBallSpeed();
    animateVillain();
    bounceCount = 0;
    ufoCount = 0;
    gameStarted = true;
  }
}

function animateVillain(){
  villainX = random(borderWidth, canvasWidth-borderWidth-villainWidth);
  villainY = random(borderWidth, villainMaxY);
}

function villainHit(){
  //get center coordinates of villain
  villainCenterX = villainX + villainCenterXOffset;
  villainCenterY = villainY + villainCenterYOffset;
  distance = dist(ballX, ballY, villainCenterX, villainCenterY);
  //if distance is less than both radius combined
  if(distance < ballRadius + villainCenterYOffset){//ball hit villain
    animateVillain();
    shipCaught.play();
    ufoCount += 1;
  }
}

function drawVillain(xCoord, yCoord){
  image(villain, xCoord, yCoord, villainWidth, villainHeight);
  villainHit();
}
function draw(){ //game loop
  if(backgroundY1 > canvasHeight){ //bring background1 back to top
    backgroundY1 = 0
  }
  if(backgroundY2 > 0){ //bring background2 back to top
    backgroundY2 = -canvasHeight;
  }
  //draw backgrounds
  image(backgroundImage, 0, backgroundY1, canvasWidth, canvasHeight);
  image(backgroundImage, 0, backgroundY2, canvasWidth, canvasHeight);
  //move backgrounds down to animate them
  backgroundY1 += backgroundSpeed;
  backgroundY2 += backgroundSpeed;
  //draw borders
  drawBorders()
  //create game objects
  drawScoreBoard(bounceCount, ufoCount);
  drawVillain(villainX, villainY);
  drawPaddle(paddleXcoord);
  drawBall(ballX, ballY);

  //animation
  animateBallColor();
  if(gameStarted){
    animatePaddle();
    animateBall();
  }
  else{
    textAlign(CENTER);
    text("Click to Begin", canvasWidth/2, (canvasHeight/2)-ballRadius);
  }
}

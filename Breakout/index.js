import shapes from './shapes.js';

const c = document.getElementById('myCanvas');

const widthS = screen.width;
const heightS = screen.height;

const width = (widthS * 60) / 100;
const height = (heightS * 90) / 100;

c.width = 650;
c.height = 700;

// c.width = c.offsetWidth;
// c.height = c.offsetHeight;

/* Constants for bricks */
const NUM_ROWS = 8;
const BRICK_TOP_OFFSET = 10;
const BRICK_SPACING = 2;
const NUM_BRICKS_PER_ROW = 10;
const BRICK_HEIGHT = 10;
const SPACE_FOR_BRICKS = c.width - (NUM_BRICKS_PER_ROW + 1) * BRICK_SPACING;
const BRICK_WIDTH = SPACE_FOR_BRICKS / NUM_BRICKS_PER_ROW;

/* Constants for ball and paddle */
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 15;
const PADDLE_OFFSET = 10;

const BALL_RADIUS = 15;

// My global variables
const NUM_OF_BRICKS = NUM_ROWS * NUM_BRICKS_PER_ROW;
const lives = 3;
// const ball;
// const paddle;
const colors = [
  'red',
  'red',
  'orange',
  'orange',
  'green',
  'green',
  'blue',
  'blue',
];
let dx = -3;
let dy = 3;
const paddleX = (c.width - PADDLE_WIDTH) / 2;
const paddleY = c.height - (PADDLE_OFFSET + PADDLE_HEIGHT);
// const lost;
// const won;
let notMoving = true;

const ctx = c.getContext('2d');

const centerX = c.width / 2;
const centerY = c.height / 2;

let mover;
let request;

const ball = new shapes.Circle(centerX, centerY, BALL_RADIUS);

function checkLeftWall() {
  return dx + ball.getX() - BALL_RADIUS < 0;
}

function checkRightWall() {
  return dx + ball.getX() + BALL_RADIUS > c.width;
}

function checkTopWall() {
  return dy + ball.getY() - BALL_RADIUS < 0;
}

function checkBottomWall() {
  return dy + ball.getY() + BALL_RADIUS > c.height;
}

function checkWalls() {
  // If hitting the LEFT wall
  if (checkLeftWall()) {
    dx = -dx;
  }

  // If hitting the RIGHT wall
  if (checkRightWall()) {
    dx = -dx;
  }

  // If hitting the TOP wall
  if (checkTopWall()) {
    dy = -dy;
  }

  // If hitting the BOTTOM wall
  if (checkBottomWall()) {
    // lives--;
    // startOrPause();
    clearInterval(mover);
    notMoving = !notMoving;
    ball.centerAt(centerX, centerY);
  }
}

function startOrPause() {
  if (notMoving) {
    mover = setInterval(() => {
      moveBall();
    }, 20);
    notMoving = !notMoving;
  } else {
    clearInterval(mover);
    notMoving = !notMoving;
  }
}

function moveBall() {
  checkWalls();
  ball.move(dx, dy);
}

c.addEventListener('click', startOrPause);

const rect = new shapes.Rectangle(100, 100, 100, 100, 'red');

export { ctx };

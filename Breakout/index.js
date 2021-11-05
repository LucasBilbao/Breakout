import shapes from './shapes.js';

const c = document.getElementById('myCanvas');

const widthS = window.innerWidth;
const heightS = window.innerHeight;

if (widthS <= 768) {
  c.width = (widthS * 99) / 100;
  c.height = (heightS * 95) / 100;
} else {
  c.width = (widthS * 60) / 100;
  c.height = (heightS * 90) / 100;
}

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
let lives = 3;
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
const angleX = Math.random() * (1 - -1) + -1 <= 0 ? -1 : 1;
const angleY = Math.random() * (1 - -1) + -1 <= 0 ? -1 : 1;

let dx = angleX * (Math.random() * (4 - 3) + 3);
let dy = angleY * (Math.random() * (4 - 3) + 3);

const paddleX = (c.width - PADDLE_WIDTH) / 2;
const paddleY = c.height - (PADDLE_OFFSET + PADDLE_HEIGHT);
let notMoving = true;

const ctx = c.getContext('2d');

const centerX = c.width / 2;
const centerY = c.height / 2;

let mover;

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
    lives--;
    clearInterval(mover);
    notMoving = !notMoving;
    ball.centerAt(centerX, centerY);
  }
}

function isGameOver() {
  return lives === 0;
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

function checkPaddle() {
  if (
    ball.getY() + dy + ball.getRadius() >= paddle.getY() &&
    ball.getX() >= paddle.getX() &&
    ball.getX() <= paddle.getX() + paddle.getWidth() &&
    !(ball.getY() >= paddle.getY())
  ) {
    dy = -dy;
  }
}

function moveBall() {
  checkWalls();
  checkObj();
  ball.move(dx, dy);
  regenerate(bricks);

  if (
    ball.getY() + ball.getRadius() >= paddle.getY() &&
    inInterval(ball.getX(), paddle.getX(), paddle.getX() + paddle.getWidth())
  ) {
    paddle.move(paddle.getX);
  }

  if (isWon()) {
    won();
  }

  if (isGameOver()) {
    gameOver();
  }
}

function won() {
  clearInterval(mover);
  notMoving = !notMoving;
  clearOut();
  new shapes.Text('You Won', (c.width - 192.1640625) / 2, (c.height - 5) / 2);
}

function isWon() {
  return bricks.length === 0;
}

function gameOver() {
  clearOut();
  new shapes.Text('Game Over', (c.width - 248.0625) / 2, (c.height - 5) / 2);
}

function clearOut() {
  ball.clear();
  delete window.ball;
  c.removeEventListener('click', startOrPause);
  c.removeEventListener('touchstart', startOrPause);
  c.removeEventListener('touchend', startOrPause);
}

function checkObj() {
  checkPaddle();
  checkBrick();
}

function inInterval(x, a, b) {
  return x >= a && x <= b;
}

function checkBrick() {
  for (let i = 0; i < bricks.length; i += 1) {
    const top = ball.getY() + dy - 5;
    if (
      inInterval(top, bricks[i].y, bricks[i].y + BRICK_HEIGHT) &&
      inInterval(ball.getX(), bricks[i].x, bricks[i].x + BRICK_WIDTH)
    ) {
      dy = -dy;
      shapes.Rectangle.break(
        bricks[i].x,
        bricks[i].y,
        bricks[i].brick.getWidth(),
        bricks[i].brick.getHeight()
      );
      bricks = removeAt(bricks, i);
      return;
    }

    const bottom = ball.getY() + dy + 5;
    if (
      inInterval(bottom, bricks[i].y, bricks[i].y + BRICK_HEIGHT) &&
      inInterval(ball.getX(), bricks[i].x, bricks[i].x + BRICK_WIDTH)
    ) {
      dy = -dy;
      shapes.Rectangle.break(
        bricks[i].x,
        bricks[i].y,
        bricks[i].brick.getWidth(),
        bricks[i].brick.getHeight()
      );
      bricks = removeAt(bricks, i);
      return;
    }

    const left = ball.getX() + dx + 5;
    if (
      inInterval(ball.getY(), bricks[i].y, bricks[i].y + BRICK_HEIGHT) &&
      inInterval(left, bricks[i].x, bricks[i].x + BRICK_WIDTH)
    ) {
      dx = -dx;
      shapes.Rectangle.break(
        bricks[i].x,
        bricks[i].y,
        bricks[i].brick.getWidth(),
        bricks[i].brick.getHeight()
      );
      bricks = removeAt(bricks, i);
      return;
    }

    const right = ball.getX() + dx - 5;
    if (
      inInterval(ball.getY(), bricks[i].y, bricks[i].y + BRICK_HEIGHT) &&
      inInterval(right, bricks[i].x, bricks[i].x + BRICK_WIDTH)
    ) {
      dx = -dx;
      shapes.Rectangle.break(
        bricks[i].x,
        bricks[i].y,
        bricks[i].brick.getWidth(),
        bricks[i].brick.getHeight()
      );
      bricks = removeAt(bricks, i);
      return;
    }
  }
}

function regenerate(arr) {
  arr.forEach((item) => {
    item.brick.putInCanvas();
  });
}

function removeAt(arr, index) {
  let res = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (index !== i) {
      res = [...res, arr[i]];
    }
  }
  return res;
}

let h1 = document.createElement('h1');
document.body.appendChild(h1);

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect();

  h1.innerHTML = `${isTouchDevice()}`;
  if (isTouchDevice()) {
    return {
      x: evt.touch[0].clientX - rect.left,
      y: evt.touch[0].clientY - rect.top,
    };
  }
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

c.addEventListener('click', startOrPause);
c.addEventListener('touchstart', startOrPause);

const paddle = new shapes.Rectangle(
  paddleX,
  paddleY,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  '#42b6bd'
);

function moveThePaddle(e) {
  if (e.x <= paddle.getWidth() / 2) {
    paddle.move(0 + paddle.getWidth() / 2);
  } else if (e.x >= c.width - paddle.getWidth() / 2) {
    paddle.move(c.width - paddle.getWidth() / 2);
  } else {
    paddle.move(e.x);
  }
}

c.addEventListener('touchmove', (e) => {
  moveThePaddle(getMousePos(c, e));
});

c.addEventListener('mousemove', (e) => {
  moveThePaddle(getMousePos(c, e));
});

function drawBricks() {
  let res = [];
  let xPos, yPos, brick;
  for (let i = 0; i < NUM_ROWS; ++i) {
    yPos = BRICK_TOP_OFFSET + i * (BRICK_HEIGHT + BRICK_SPACING);
    for (let j = 0; j < NUM_BRICKS_PER_ROW; ++j) {
      xPos = BRICK_SPACING + j * (BRICK_WIDTH + BRICK_SPACING);
      brick = {
        x: xPos,
        y: yPos,
        brick: new shapes.Rectangle(
          xPos,
          yPos,
          BRICK_WIDTH,
          BRICK_HEIGHT,
          colors[i]
        ),
      };
      res = [...res, brick];
    }
  }
  return res;
}

let bricks = drawBricks();

export { ctx };

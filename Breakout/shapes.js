import { ctx } from './index.js';

class Circle {
  #x;
  #y;
  #radius;
  #counterClockwise;
  constructor(
    x = 0,
    y = 0,
    radius = 15,
    color = 'black',
    startAngle = 0,
    endAngle = 2 * Math.PI,
    counterClockwise = false
  ) {
    this.#x = x;
    this.#y = y;
    this.#radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.#counterClockwise = counterClockwise;
    this.color = color;
    this.putInCanvas();
  }

  putInCanvas() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(
      this.#x,
      this.#y,
      this.#radius,
      this.startAngle,
      this.endAngle,
      this.#counterClockwise
    );
    ctx.fill();
    ctx.closePath();
  }

  getX() {
    return this.#x;
  }

  getY() {
    return this.#y;
  }

  getRadius() {
    return this.#radius;
  }

  move(dx, dy) {
    this.clear();
    this.#x += dx;
    this.#y += dy;
    this.putInCanvas();
  }

  clear() {
    ctx.beginPath();
    ctx.arc(
      this.#x,
      this.#y,
      this.#radius + 1,
      this.startAngle,
      this.endAngle,
      this.#counterClockwise
    );
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }

  centerAt(x, y) {
    this.clear();
    this.#x = x;
    this.#y = y;
    this.putInCanvas();
  }
}

class Rectangle {
  #x;
  #y;
  #width;
  #height;
  #color;
  constructor(x, y, width, height, color) {
    this.#x = x;
    this.#y = y;
    this.#width = width;
    this.#height = height;
    this.#color = color;
    this.putInCanvas();
  }

  putInCanvas() {
    ctx.beginPath();
    ctx.fillStyle = this.#color;
    ctx.fillRect(this.#x, this.#y, this.#width, this.#height);
    ctx.closePath();
  }
}

export default { Circle, Rectangle };

import Circle from "./circle.js";

export default class App {
  constructor() {
    this.canvas = null;
    this.ctx = null;
  }

  createCanvas(width, height) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  circle(x, y, radius) {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  createGrid() {
    const monCercle = new Circle(this.ctx);
    let stepX = 50;
    let stepY = 20;
    let radius = 5;
    let spaceX = window.innerWidth / stepX;
    let spaceY = window.innerHeight / stepY;

    for (let i = 0; i < stepX; i++) {
      for (let j = 0; j < stepY; j++) {
        monCercle.circle(i * spaceX + radius, j * spaceY + radius, 10);
      }
    }
  }
}

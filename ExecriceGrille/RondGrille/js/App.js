import Circle from "./Circle.js";

export default class App {
  constructor() {
    this.canvas;
    this.ctx;
  }

  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    document.body.appendChild(this.canvas);
  }

  createGrid() {
    const monCercle = new Circle(this.ctx);
    let stepX = 120;
    let stepY = 185;
    let maxRadius = 12;
    let minRadius = 10;

    let centerX = this.canvas.width / 2;
    let centerY = this.canvas.height / 2;

    for (let i = 0; i < stepX; i++) {
      for (let j = 0; j < stepY; j++) {
        let x = (i / stepX) * this.canvas.width;
        let y = (j / stepY) * this.canvas.height;

        let distanceToCenter = Math.sqrt(
          Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
        );

        let maxDistance = Math.sqrt(
          Math.pow(centerX, 2) + Math.pow(centerY, 2)
        );
        let ratio = 1 - distanceToCenter / maxDistance;
        let radius = minRadius + ratio * (maxRadius - minRadius);

        let spacingMultiplier = 0.1 + (distanceToCenter / maxDistance) * 2;

        monCercle.drawCross(
          centerX + (x - centerX) * spacingMultiplier,
          centerY + (y - centerY) * spacingMultiplier,
          radius
        );
      }
    }
  }
}

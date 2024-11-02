import Circle from "./Circle.js";

export default class App {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.resizeHandler = this.handleResize.bind(this);
  }

  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);

    this.handleResize();
    window.addEventListener("resize", this.resizeHandler);

    this.createGrid();
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createGrid() {
    const monCercle = new Circle(this.ctx);
    const stepX = 120;
    const stepY = 185;
    const maxRadius = 12;
    const minRadius = 10;

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

        let animatedX = centerX + (x - centerX) * spacingMultiplier;
        let animatedY = centerY + (y - centerY) * spacingMultiplier;

        let colorValue = Math.floor(255 * ratio);
        this.ctx.strokeStyle = `rgb(${colorValue}, ${255 - colorValue}, 150)`;

        this.ctx.save();
        this.ctx.translate(animatedX, animatedY);

        monCercle.drawCross(0, 0, radius);
        this.ctx.restore();
      }
    }
  }
}

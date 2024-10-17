import Letter from "./Letter.js";

export default class App {
  constructor() {
    console.log("app hello");
    this.canvas;
    this.ctx;
    this.createCanvas();

    this.cols = 10;
    this.rows = 10;

    this.letters = [];
    this.createLettersGrid();

    this.initInteraction();

    this.draw();
  }

  createCanvas(width = window.innerWidth, height = window.innerHeight) {
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
  }

  createLettersGrid() {
    const cellWidth = this.width / this.cols;
    const cellHeight = this.height / this.rows;
    const radius = Math.min(cellWidth, cellHeight) / 4;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2;
        const letter = new Letter(x, y, radius);
        this.letters.push(letter);
      }
    }
  }

  initInteraction() {
    document.addEventListener("mousemove", (e) => {
      this.letters.forEach((letter) => {
        const dist = Math.sqrt(
          (e.clientX - letter.x) ** 2 + (e.clientY - letter.y) ** 2
        );

        if (dist < letter.radius) {
          letter.targetRadius = Math.random() * 50 + 20;
        } else {
          letter.targetRadius = letter.originRadius;
        }
      });
    });
  }

  draw() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.letters.forEach((letter) => {
      letter.update();
      letter.dessine(this.ctx);
    });

    requestAnimationFrame(this.draw.bind(this));
  }
}

import BaseApp from "./BaseApp.js";
import Utils from "./Utils.js";

export default class App extends BaseApp {
  constructor() {
    super();
    this.time = 0;
    this.amplitude = 10;
    this.frequency = 0.05;
    this.opacity = 1;
    this.isHovered = false;
    this.isLetterVisible = true;
    this.letterWidth = 0;
    this.letterHeight = 0;
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.mousePositions = [];

    Utils.loadSVG("letter.svg").then((letterPoints) => {
      this.letter = letterPoints;
      this.calculateLetterSize();
      this.animate();
    });

    this.canvas.addEventListener("mouseenter", () => {
      this.isHovered = true;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.isHovered = false;
      this.isLetterVisible = true;
      this.mouseX = this.width / 2;
      this.mouseY = this.height / 2;
    });

    this.canvas.addEventListener("mousemove", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouseX = event.clientX - rect.left;
      this.mouseY = event.clientY - rect.top;

      this.mousePositions.push({ x: this.mouseX, y: this.mouseY });

      if (this.mousePositions.length > 20) {
        this.mousePositions.shift();
      }
    });

    this.canvas.addEventListener("click", () => {
      if (!this.isLetterVisible) {
        this.isLetterVisible = true;
      }
    });
  }

  calculateLetterSize() {
    this.letterWidth = 612;
    this.letterHeight = 792;
  }

  animate() {
    this.time += 0.15;
    this.opacity = 0.7 + 0.3 * Math.sin(this.time * 0.5);
    this.ctx.fillStyle = this.isHovered ? "black" : "white";
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (this.isHovered) {
      this.mousePositions.forEach(({ x, y }) => {
        this.ctx.save();
        this.ctx.translate(x - this.letterWidth / 2, y - this.letterHeight / 2);
        this.ctx.rotate(0.01 * Math.sin(this.time * 0.3));

        this.ctx.beginPath();
        this.letter.forEach(this.drawPath.bind(this));

        this.ctx.fillStyle = `rgba(0, 150, 255, ${this.opacity})`;
        this.ctx.fill();
        this.ctx.restore();
      });
    } else {
      this.ctx.save();
      this.ctx.translate(
        this.mouseX - this.letterWidth / 2,
        this.mouseY - this.letterHeight / 2
      );
      this.ctx.rotate(0.01 * Math.sin(this.time * 0.3));

      this.ctx.beginPath();
      this.letter.forEach(this.drawPath.bind(this));

      this.ctx.fillStyle = `hsl(${(this.time * 20) % 360}, 100%, 50%)`;
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(this.animate.bind(this));
  }

  drawPath(path) {
    for (let i = 0; i < path.length; i++) {
      const point = path[i];

      const angle = (Math.floor(this.time + i * this.frequency) * Math.PI) / 6;
      const xOffset = Math.cos(angle) * this.amplitude * 0.5;
      const yOffset = Math.sin(angle) * this.amplitude * 0.5;

      const x = point.x + xOffset;
      const y = point.y + yOffset;

      this.ctx.fillStyle = this.isHovered
        ? "white"
        : `hsl(${(this.time * 20 + i * 5) % 360}, 100%, 50%)`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      this.ctx.fill();

      if (i !== 0) {
        this.ctx.lineTo(x, y);
      } else {
        this.ctx.moveTo(x, y);
      }
    }
  }
}

import BaseApp from "./BaseApp";
import Letter from "./Letter";
import Webcam from "./Webcam";
import Particle from "./Particle";

export default class App extends BaseApp {
  constructor() {
    super();
    this.ctx.willReadFrequently = true;
    this.ctx.font = `30px monospace`;
    this.letters = [];
    this.particles = [];
    this.pixelColors = [];
    this.init();
  }

  loadImage(src) {
    return new Promise((resolve) => {
      this.image = new Image();
      this.image.onload = resolve;
      this.image.src = src;
    });
  }

  loadWebcam() {
    this.webcam = new Webcam();
  }

  async init() {
    await this.loadImage("./image/andy.jpg");
    this.loadWebcam();
    for (let i = 0; i < 210; i++) {
      for (let j = 0; j < 110; j++) {
        this.letters.push(new Letter(this.ctx, "o", i * 10, j * 10));
      }
    }
    this.draw();
  }

  createParticles(x, y) {
    const particleCount = Math.random() < 0.2 ? 1 : 0;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.ctx, x, y));
    }
  }

  draw() {
    this.ctx.drawImage(this.webcam.video, 0, 0, 1920, 1080);
    const pixels = this.ctx.getImageData(0, 0, 1920, 1080).data;

    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.letters.forEach((letter) => {
      const i = (letter.y * 1920 + letter.x) * 4;
      letter.scale = this.getLuminance([
        pixels[i],
        pixels[i + 1],
        pixels[i + 2],
      ]);
      if (letter.scale > 0.999999999999) {
        this.createParticles(letter.x, letter.y);
      }
      letter.draw();
    });

    this.particles = this.particles.filter((particle) => {
      const isAlive = particle.update();
      if (isAlive) {
        particle.draw();
      }
      return isAlive;
    });

    requestAnimationFrame(this.draw.bind(this));
  }

  getLuminance(rgb) {
    return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
  }
}

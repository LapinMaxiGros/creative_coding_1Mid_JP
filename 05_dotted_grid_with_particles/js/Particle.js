export default class Particle {
  constructor(ctx, x, y, color = "blue") {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = 5 + Math.random() * 10;
    this.alpha = 1;
    this.speed = 2 + Math.random() * 2;
    this.angle = Math.random() * Math.PI * 2;
    this.fadeSpeed = 0.4;
    this.color = color;
    this.text = "COCO";
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    this.alpha -= this.fadeSpeed;

    return this.alpha > 0;
  }

  draw() {
    this.ctx.save();
    this.ctx.globalAlpha = this.alpha;
    this.ctx.fillStyle = this.color;

    this.ctx.font = `${this.size}px monospace`;
    this.ctx.fillText(this.text, this.x, this.y);

    this.ctx.restore();
  }
}

export default class Letter {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.originRadius = radius;
    this.targetRadius = radius;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.character = characters[Math.floor(Math.random() * characters.length)];
    this.speed = 0.01;
  }

  dessine(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.font = `${this.radius}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.character, this.x, this.y);
  }

  update() {
    this.radius += (this.targetRadius - this.radius) * 0.3;
  }
}

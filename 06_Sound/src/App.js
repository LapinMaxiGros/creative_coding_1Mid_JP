import BaseApp from "./BaseApp";

export default class App extends BaseApp {
  constructor() {
    super();
    this.audioFile = "./Music.mp3";
    this.audio = new Audio(this.audioFile);
    this.audio.controls = true;
    document.body.appendChild(this.audio);
    this.isPlaying = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.init();
  }

  init() {
    document.addEventListener("click", (e) => {
      if (!this.audioContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext();
        this.setup();
      }

      const postion_souris_x = e.clientX;
      const pourcentage = postion_souris_x / window.innerWidth;
      this.audio.currentTime = this.audio.duration * pourcentage;
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
      }
    });

    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  setup() {
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.analyser = this.audioContext.createAnalyser();
    this.destination = this.audioContext.destination;
    this.source.connect(this.analyser);
    this.analyser.connect(this.destination);

    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.fftSize);
    this.waveArray = new Uint8Array(this.analyser.fftSize);
    this.draw();
  }

  analyseFrequencies() {
    this.analyser.getByteFrequencyData(this.dataArray);
  }

  analyseWaveform() {
    this.analyser.getByteTimeDomainData(this.waveArray);
  }

  draw() {
    this.analyseFrequencies();
    this.analyseWaveform();

    this.ctx.clearRect(0, 0, this.width, this.height);

    const circleSpacing = this.width / (this.dataArray.length / 2);
    let x = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      const size = this.dataArray[i] * 0.8;

      const gradient = this.ctx.createRadialGradient(
        this.mouseX,
        this.mouseY,
        0,
        this.mouseX,
        this.mouseY,
        size * 2
      );
      const colorStart = `rgb(0, 0, ${size + 100})`;
      const colorEnd = `rgb(50, 50, ${size + 100})`;
      gradient.addColorStop(0, colorStart);
      gradient.addColorStop(1, colorEnd);

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(this.mouseX, this.mouseY, size, 0, 2 * Math.PI);
      this.ctx.fill();

      x += circleSpacing;
    }

    const waveSpace = this.width / this.waveArray.length;
    for (let i = 0; i < this.waveArray.length; i++) {
      const size = (this.waveArray[i] / 128) * 10 + 5;
      const xPos = this.mouseX + i * waveSpace - this.width / 2;
      const yPos =
        this.mouseY + (this.waveArray[i] / 128) * this.height - this.height / 2;

      const waveGradient = this.ctx.createRadialGradient(
        xPos,
        yPos,
        0,
        xPos,
        yPos,
        size * 2
      );
      waveGradient.addColorStop(0, "rgba(148, 0, 211, 0.7)");
      waveGradient.addColorStop(1, "rgba(148, 0, 211, 0.4)");

      this.ctx.fillStyle = waveGradient;
      this.ctx.font = `${size}px Arial`;
      this.ctx.fillText("K", xPos, yPos);
    }

    requestAnimationFrame(this.draw.bind(this));
  }
}

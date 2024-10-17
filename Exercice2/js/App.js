import Letter from "./Letter.js";

export default class App {
  constructor() {
    console.log("app hello");
    this.canvas;
    this.ctx;
    // premier étape : créer le canvas
    this.createCanvas();

    // nombre de colonnes et lignes pour la grille
    this.cols = 10;
    this.rows = 10;

    // initialiser les lettres sous forme de grille
    this.letters = [];
    this.createLettersGrid();

    // initialiser l'interaction click
    this.initInteraction();

    // dessiner le canvas
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

  // Créer une grille de lettres
  createLettersGrid() {
    const cellWidth = this.width / this.cols;
    const cellHeight = this.height / this.rows;
    const radius = Math.min(cellWidth, cellHeight) / 4; // Ajuster la taille du rayon

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const x = col * cellWidth + cellWidth / 2; // Position au centre de la cellule
        const y = row * cellHeight + cellHeight / 2;
        const letter = new Letter(x, y, radius);
        this.letters.push(letter);
      }
    }
  }

  initInteraction() {
    document.addEventListener("click", (e) => {
      // Vérifier si le clic est sur une des lettres
      this.letters.forEach((letter) => {
        const dist = Math.sqrt(
          (e.x - letter.x) * (e.x - letter.x) +
            (e.y - letter.y) * (e.y - letter.y)
        );

        // Si le clic est dans le rayon de la lettre, on déclenche l'animation sur cette lettre
        if (dist < letter.radius) {
          letter.reset(e.x, e.y);
        }
      });
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Dessiner toutes les lettres de la grille
    this.letters.forEach((letter) => {
      letter.update();
      letter.dessine(this.ctx);
    });

    // Transformer le canvas en flip book
    requestAnimationFrame(this.draw.bind(this));
  }
}

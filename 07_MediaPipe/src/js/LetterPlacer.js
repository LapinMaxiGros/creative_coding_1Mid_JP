export class LetterPlacer {
  constructor(ctx, speechListener) {
    this.ctx = ctx;
    this.speechListener = speechListener;
    this.letter = "M"; // Lettre initiale
    this.font = "Helvetica"; // Police d'écriture
    this.minFontSize = 10;
    this.maxFontSize = 1000;

    this.smoothingFactor = 0.7;
    this.smoothedPoints = {
      thumb: null,
      index: null,
    };

    // Liste des lettres possibles
    this.letters = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];

    // Particules
    this.particles = [];
    this.particleSpeed = 2; // Vitesse des particules
    this.particleLifeTime = 100; // Temps de vie des particules
    this.isLetterExploded = false; // Indicateur pour savoir si la lettre s'est déjà explosée
    this.isPinched = false; // Indicateur pour savoir si le pouce et l'index sont en contact
    this.debounceTimeout = null; // Pour limiter le nombre de changements de lettre
  }

  smoothPoint(newPoint, lastPoint) {
    if (!lastPoint) return newPoint;

    const smooth = (a, b) =>
      this.smoothingFactor * a + (1 - this.smoothingFactor) * b;

    return {
      x: smooth(lastPoint.x, newPoint.x),
      y: smooth(lastPoint.y, newPoint.y),
      z: smooth(lastPoint.z, newPoint.z),
    };
  }

  analyzePinchDistance(landmarks) {
    const rawThumb = landmarks[4]; // Position du bout du pouce
    const rawIndex = landmarks[8]; // Position du bout de l'index

    this.smoothedPoints.thumb = this.smoothPoint(
      rawThumb,
      this.smoothedPoints.thumb
    );
    this.smoothedPoints.index = this.smoothPoint(
      rawIndex,
      this.smoothedPoints.index
    );

    // Calculer la distance entre le pouce et l'index
    const distance = Math.hypot(
      this.smoothedPoints.index.x - this.smoothedPoints.thumb.x,
      this.smoothedPoints.index.y - this.smoothedPoints.thumb.y
    );

    // Si les doigts se touchent, commencer à changer la lettre et faire défiler
    if (distance < 0.05 && !this.isPinched) {
      this.isPinched = true;
      this.startLetterScroll();
    }

    // Si les doigts se détachent, exploser la lettre en particules
    if (distance > 0.2 && this.isPinched) {
      this.isPinched = false;
      this.explodeLetter();
    }

    // Si le système de particules existe, on le met à jour et le dessine
    if (this.particles.length > 0) {
      this.updateParticles();
      this.drawParticles();
    } else {
      // Place la lettre normalement si elle n'a pas été explosée
      this.placeLetter(this.smoothedPoints.thumb, this.smoothedPoints.index);
    }
  }

  // Commence à faire défiler les lettres de manière aléatoire
  startLetterScroll() {
    // Change la lettre toutes les 100ms
    if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setInterval(() => {
      this.changeLetter();
    }, 100); // Changer toutes les 100ms
  }

  // Change la lettre de manière aléatoire
  changeLetter() {
    const randomIndex = Math.floor(Math.random() * this.letters.length);
    this.letter = this.letters[randomIndex]; // Choisir une lettre aléatoire
    console.log(`Lettre changeante: ${this.letter}`); // Afficher la lettre choisie dans la console
  }

  // Explose la lettre en particules
  explodeLetter() {
    this.isLetterExploded = true; // Indiquer que la lettre a été explosée
    const { width, height } = this.ctx.canvas;

    // Position centrale pour l'explosion (au centre des doigts)
    const centerX =
      ((this.smoothedPoints.thumb.x + this.smoothedPoints.index.x) / 2) * width;
    const centerY =
      ((this.smoothedPoints.thumb.y + this.smoothedPoints.index.y) / 2) *
      height;

    // Calculer la taille de la lettre
    const fontSize = this.calculateOptimalFontSize(
      Math.hypot(
        this.smoothedPoints.index.x - this.smoothedPoints.thumb.x,
        this.smoothedPoints.index.y - this.smoothedPoints.thumb.y
      ),
      0
    );
    this.ctx.font = `${fontSize}px ${this.font}`;

    // Diviser la lettre en particules
    const letterWidth = this.ctx.measureText(this.letter).width;
    const letterHeight = fontSize; // Simple approximation de la hauteur de la lettre

    for (let i = 0; i < letterWidth * letterHeight * 0.2; i++) {
      // Générer des particules aléatoires autour du centre de la lettre
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 10; // Rayon aléatoire pour disperser les particules
      const particleX = centerX + radius * Math.cos(angle);
      const particleY = centerY + radius * Math.sin(angle);

      // Ajouter la particule avec une direction et une vitesse aléatoire
      this.particles.push({
        x: particleX,
        y: particleY,
        vx: (Math.random() - 0.5) * this.particleSpeed,
        vy: (Math.random() - 0.5) * this.particleSpeed,
        life: this.particleLifeTime, // Durée de vie de la particule
      });
    }
  }

  // Met à jour la position des particules
  updateParticles() {
    for (let particle of this.particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 1; // Réduire la durée de vie

      // Retirer les particules qui sont mortes
      if (particle.life <= 0) {
        this.particles = this.particles.filter((p) => p !== particle);
      }
    }
  }

  // Dessiner les particules
  drawParticles() {
    this.ctx.save();
    for (let particle of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, 3, 0, 2 * Math.PI); // Particules de rayon 3
      this.ctx.fillStyle = `rgba(255, 255, 255, ${
        particle.life / this.particleLifeTime
      })`; // Translucidité
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  // Place la lettre normalement (avant l'explosion)
  placeLetter(thumb, index) {
    const { width, height } = this.ctx.canvas;
    const [thumbX, thumbY] = [thumb.x * width, thumb.y * height];
    const [indexX, indexY] = [index.x * width, index.y * height];

    const centerX = (thumbX + indexX) / 2;
    const centerY = (thumbY + indexY) / 2;
    const angle = Math.atan2(indexY - thumbY, indexX - thumbX) + Math.PI / 2;
    const distance = Math.hypot(indexX - thumbX, indexY - thumbY);

    const fontSize = this.calculateOptimalFontSize(distance, angle);
    this.ctx.font = `${fontSize}px ${this.font}`;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(angle);

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(this.letter, 0, distance / 10);

    this.ctx.restore();
  }

  calculateOptimalFontSize(distance, angle) {
    this.ctx.font = `${distance}px ${this.font}`;
    const letterWidth = this.ctx.measureText(this.letter).width;
    const finalSize = Math.round(distance * (distance / letterWidth));

    return Math.max(this.minFontSize, Math.min(finalSize, this.maxFontSize));
  }

  mapNumber(number, inmin, inmax, outmin, outmax) {
    return ((number - inmin) / (inmax - inmin)) * (outmax - outmin) + outmin;
  }

  updateVariableFont() {
    // Paramètres de mise à jour de la police
  }
}

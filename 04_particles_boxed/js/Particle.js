/**
 * Classe représentant une particule dans l'animation
 * Chaque particule est un point qui peut se déplacer et changer de couleur
 */
export default class Particle {
  /**
   * Crée une nouvelle particule
   * @param {number} x - Position horizontale de départ
   * @param {number} y - Position verticale de départ
   * @param {string} color - Couleur de la particule (format hex: "#RRGGBB")
   * @param {number} size - Taille de la particule
   * @param {number} speed - Vitesse de la particule
   */
  constructor(x, y, color, size, speed) {
    // Position
    this.x = x;
    this.y = y;

    // Vitesse sur chaque axe (aléatoire au départ)
    this.vx = (Math.random() - 0.5) * 4; // Vitesse horizontale
    this.vy = (Math.random() - 0.5) * 4; // Vitesse verticale

    // Apparence
    this.radius = 2;
    this.color = color;
    this.size = size;
    this.speed = speed;

    // État
    this.isRepelled = false; // Indique si la particule est repoussée par la souris
    this.hasReachedTarget = false; // Indique si la particule a atteint sa position cible
    this.friction = 0.98; // Ralentissement naturel (1 = pas de ralentissement)
  }

  /**
   * Met à jour la position et la vitesse de la particule
   */
  update() {
    // Ajoute un peu de mouvement aléatoire
    this.vx += (Math.random() - 0.5) * 0.2;
    this.vy += (Math.random() - 0.5) * 0.2;

    // Applique la friction pour ralentir progressivement
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Limite la vitesse maximale
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > 5) {
      this.vx = (this.vx / speed) * 2;
      this.vy = (this.vy / speed) * 2;
    }

    // Réinitialise l'état "repoussé" si la particule est presque arrêtée
    if (speed < 0.9 && this.isRepelled) {
      this.isRepelled = false;
    }

    // Met à jour la position selon la vitesse
    this.x += this.vx;
    this.y += this.vy;
  }

  /**
   * Dessine la particule sur le canvas
   * @param {CanvasRenderingContext2D} ctx - Le contexte de dessin du canvas
   * @param {boolean} isWhiteBackground - Indique si le fond est blanc
   */
  draw(ctx, isWhiteBackground = false) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    // Choisit la couleur selon le contexte
    if (isWhiteBackground) {
      // Sur fond blanc, utilise la couleur assignée
      ctx.fillStyle = this.color;
    } else {
      // Sur fond noir, alterne entre blanc et rose selon l'état
      ctx.fillStyle = this.isRepelled ? "pink" : "white";
    }

    ctx.fill();
  }
}

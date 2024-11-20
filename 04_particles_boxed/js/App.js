import BaseApp from "./BaseApp";
import Utils from "./Utils";
import Particle from "./Particle";

/**
 * Classe principale de l'application
 * Gère l'animation des particules et leur interaction avec la souris
 */
export default class App extends BaseApp {
  /**
   * Initialise l'application
   */
  constructor() {
    super();

    // Stockage des chemins SVG et des particules
    this.paths = []; // Chemin du premier SVG (lettre)
    this.paths2 = []; // Chemin du deuxième SVG (lettre X)
    this.particles = []; // Liste des particules
    this.initialParticleStates = []; // État initial des particules

    // Configuration
    this.numParticles = 1000; // Nombre de particules à créer
    this.mouseRadius = 100; // Rayon d'interaction avec la souris

    // État de l'application
    this.mouse = { x: 0, y: 0 }; // Position de la souris
    this.isWhiteBackground = false; // Couleur du fond

    // Palette de couleurs pour les particules
    this.colors = [
      "#FF5733", // Orange
      "#33FF57", // Vert
      "#3357FF", // Bleu
      "#FF33A1", // Rose
      "#FFC300", // Jaune
      "#FF6347", // Corail
      "#9B59B6", // Violet
      "#1F77B4", // Bleu foncé
      "#8E44AD", // Pourpre
      "#F39C12", // Orange foncé
    ];

    // Démarrage de l'application
    this.initialiserApplication();
  }

  /**
   * Initialise tous les composants de l'application
   */
  initialiserApplication() {
    this.ajouterEcouteursSouris();
    this.chargerSVGs();
    this.demarrerAnimation();
  }

  /**
   * Configure les écouteurs d'événements de la souris
   */
  ajouterEcouteursSouris() {
    // Suit le mouvement de la souris
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // Ajoute des particules quand la souris quitte la fenêtre
    window.addEventListener("mouseleave", () => {
      this.ajouterParticulesSouris();
    });

    // Réinitialise l'animation au clic
    window.addEventListener("click", () => {
      this.reinitialiserParticules();
    });
  }

  /**
   * Charge les fichiers SVG et initialise les particules
   */
  async chargerSVGs() {
    try {
      // Charge les deux SVG
      this.paths = await Utils.loadSVG("./letter.svg");
      this.paths2 = await Utils.loadSVG("./letterX.svg");

      // Centre le premier SVG et crée les particules
      this.centrerPremierSVG();
      this.creerParticules();
    } catch (error) {
      console.error("Erreur lors du chargement des SVG:", error);
    }
  }

  /**
   * Centre le premier SVG dans le canvas
   */
  centrerPremierSVG() {
    if (this.paths.length === 0) return;

    const path = this.paths[0];

    // Trouve les limites du SVG
    let [minX, minY, maxX, maxY] = [Infinity, Infinity, -Infinity, -Infinity];
    path.forEach((point) => {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    });

    // Calcule le décalage pour centrer
    const width = maxX - minX;
    const height = maxY - minY;
    this.offsetX = (this.width - width) / 2 - minX;
    this.offsetY = (this.height - height) / 2 - minY;

    // Applique le décalage à tous les points
    this.paths.forEach((path) => {
      path.forEach((point) => {
        point.x += this.offsetX;
        point.y += this.offsetY;
      });
    });
  }

  /**
   * Crée les particules initiales
   */
  creerParticules() {
    if (this.paths.length === 0) return;

    const path = this.paths[0];
    const paths2 = this.paths2[0];

    for (let i = 0; i < this.numParticles; i++) {
      // Crée une particule à une position aléatoire autour du premier chemin
      const pointDepart = path[Math.floor(Math.random() * path.length)];
      const x = pointDepart.x + (Math.random() - 0.5) * 100;
      const y = pointDepart.y + (Math.random() - 0.5) * 100;

      // Propriétés aléatoires pour la particule
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const size = Math.random() * 3 + 1;
      const speed = Math.random() * 2 + 1;

      // Crée et stocke la particule
      const particle = new Particle(x, y, color, size, speed);
      this.particles.push(particle);

      // Stocke l'état initial
      this.initialParticleStates.push({
        x: particle.x,
        y: particle.y,
        vx: particle.vx,
        vy: particle.vy,
      });

      // Définit la position cible dans le deuxième SVG
      const pointCible = paths2[Math.floor(Math.random() * paths2.length)];
      particle.targetX = pointCible.x;
      particle.targetY = pointCible.y;
    }
  }

  /**
   * Ajoute des particules à la position de la souris
   */
  ajouterParticulesSouris() {
    for (let i = 0; i < 50; i++) {
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const size = Math.random() * 3 + 1;
      const speed = Math.random() * 2 + 1;
      this.particles.push(
        new Particle(this.mouse.x, this.mouse.y, color, size, speed)
      );
    }
  }

  /**
   * Vérifie si un point est à l'intérieur du chemin SVG
   */
  estPointDansChemin(x, y) {
    if (this.paths.length === 0) return false;

    const path = this.paths[0];
    let inside = false;

    // Algorithme "ray casting" pour déterminer si un point est dans un polygone
    for (let i = 0; i < path.length; i++) {
      const currentPoint = path[i];
      const previousPoint = i === 0 ? path[path.length - 1] : path[i - 1];

      const isYBetween = currentPoint.y > y !== previousPoint.y > y;
      if (isYBetween) {
        const intersectionX =
          previousPoint.x +
          ((currentPoint.x - previousPoint.x) * (y - previousPoint.y)) /
            (currentPoint.y - previousPoint.y);

        if (x < intersectionX) {
          inside = !inside;
        }
      }
    }

    return inside;
  }

  /**
   * Trouve le point le plus proche sur le chemin SVG
   */
  trouverPointProche(x, y) {
    if (this.paths.length === 0) return { x, y };

    const path = this.paths[0];
    let pointProche = path[0];
    let distanceMin = Number.MAX_VALUE;

    path.forEach((point) => {
      const distance = Math.hypot(point.x - x, point.y - y);
      if (distance < distanceMin) {
        distanceMin = distance;
        pointProche = point;
      }
    });

    return pointProche;
  }

  /**
   * Déplace une particule vers sa position cible
   */
  deplacerVersTarget(particle) {
    const dx = particle.targetX - particle.x;
    const dy = particle.targetY - particle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      // Si pas encore arrivé
      const speed = 0.5;
      particle.vx += (dx / distance) * speed;
      particle.vy += (dy / distance) * speed;
      particle.vx *= 0.95; // Amortissement
      particle.vy *= 0.95;
      particle.isRepelled = true;
    } else {
      // Arrivé à destination
      particle.x = particle.targetX;
      particle.y = particle.targetY;
      particle.vx = 0;
      particle.vy = 0;
      particle.hasReachedTarget = true;
    }
  }

  /**
   * Replace une particule sur le chemin SVG
   */
  attacherAuChemin(particle) {
    const pointProche = this.trouverPointProche(particle.x, particle.y);
    particle.x = pointProche.x;
    particle.y = pointProche.y;
    particle.vx *= -0.9;
    particle.vy *= -0.9;
  }

  /**
   * Réinitialise toutes les particules à leur état initial
   */
  reinitialiserParticules() {
    this.isWhiteBackground = false;

    this.particles.forEach((particle, index) => {
      const etatInitial = this.initialParticleStates[index];
      if (etatInitial) {
        particle.x = etatInitial.x;
        particle.y = etatInitial.y;
        particle.vx = etatInitial.vx;
        particle.vy = etatInitial.vy;
        particle.isRepelled = false;
        particle.hasReachedTarget = false;
      }
    });
  }

  /**
   * Boucle principale d'animation
   */
  demarrerAnimation() {
    const animer = () => {
      // Définit la couleur du fond
      this.ctx.fillStyle = this.isWhiteBackground
        ? "white"
        : "rgba(0, 0, 0, 1)";
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Met à jour chaque particule
      this.particles.forEach((particle) => {
        if (particle.hasReachedTarget) {
          particle.draw(this.ctx, this.isWhiteBackground);
          return;
        }

        // Calcule la distance avec la souris
        const distanceSouris = Math.hypot(
          particle.x - this.mouse.x,
          particle.y - this.mouse.y
        );

        // Change le fond en blanc si la souris est proche
        if (distanceSouris < this.mouseRadius) {
          this.isWhiteBackground = true;
        }

        // Détermine si la particule doit bouger vers sa cible
        const doitBouger =
          distanceSouris < this.mouseRadius || particle.isRepelled;
        const aCible =
          particle.targetX !== undefined && particle.targetY !== undefined;

        if (doitBouger && aCible) {
          this.deplacerVersTarget(particle);
        } else if (
          !particle.isRepelled &&
          !this.estPointDansChemin(particle.x, particle.y)
        ) {
          this.attacherAuChemin(particle);
        }

        particle.update();
        particle.draw(this.ctx, this.isWhiteBackground);
      });

      requestAnimationFrame(animer);
    };

    animer();
  }
}

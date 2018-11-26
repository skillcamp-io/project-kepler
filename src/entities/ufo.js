import Phaser from "phaser";
import HealthBar from "./healthBar.js";

class UFO extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.sfx = {
      explode: new Audio("/assets/audio/explosion.mp3")
    };
    this.alive = true;
    this.movementDuration = 500; // Larger is slower

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.finder = this.scene.finder;

    this.hp = new HealthBar(scene, -20, -30);
    this.container = this.scene.add.container(this.x, this.y, this.hp);

    this.handleEnemyDamage(50);
    this.staggerAnimation();
    this.findPath();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.container.x = this.x;
    this.container.y = this.y;

    if (this.alive && this.hp.value <= 0) {
      this.explode();
    }
  }

  handleEnemyDamage(damageTaken) {
    const takeDamage = (pointer) => {
      this.hp.decrease(damageTaken);
      this.setTint(0xff4d4d);
      setTimeout(() => {
        this.setTint(0xffffff);
      }, 200);
    };

    this.setInteractive();
    this.on("pointerdown", takeDamage);
  }

  staggerAnimation() {
    setTimeout(() => {
      this.anims.play("ufo-float", true);
    }, Math.floor(Math.random() * 500));
  }

  explode() {
    this.alive = false;
    this.sfx.explode.play();
    this.setVelocity(0, 0);
    this.scene.tweens.killTweensOf(this);

    const particles = this.scene.add.particles("spark");

    const emitter = particles.createEmitter({
      gravityY: -110,
      maxParticles: 0,
      angle: { min: 0, max: 360 },
      alpha: { start: 1, end: 0, ease: "Linear" },
      lifespan: 900,
      maxVelocityX: 200,
      maxVelocityY: 200,
      x: this.x,
      y: this.y,
      speed: 400,
      scale: { start: 0.6, end: 0.4, ease: "Linear" }
    });

    emitter.setBlendMode(Phaser.BlendModes.ADD);

    setTimeout(() => {
      this.destroy();
      this.hp.destroy();
      emitter.visible = false;
    }, 1000);
  }

  moveAlongPath(path) {
    // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
    const tweens = path.map(tile => ({
      targets: this,
      x: {
        value: tile.x * this.scene.map.tileWidth + 32,
        duration: this.movementDuration
      },
      y: {
        value: tile.y * this.scene.map.tileHeight + 32,
        duration: this.movementDuration
      }
    }));

    this.scene.tweens.timeline({
      tweens: tweens
    });
  }

  findPath() {
    const toX = this.scene.map.width / 2;
    const toY = this.scene.map.height / 2;

    this.finder.findPath(this.x, this.y, toX, toY, path => {
      if (path === null) {
        console.warn("Path was not found.");
      } else {
        this.moveAlongPath(path);
      }
    });

    this.finder.calculate();
  }
}

export default UFO;

import Phaser from 'phaser';
import HealthBar from './healthBar.js';

class UFO extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y,  config.key);

    this.sfx = {
      explode: new Audio('/assets/audio/explosion.mp3'),
    };

    this.alive = true;

    this.scene = scene;
    this.finder = this.scene.finder;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.hp = new HealthBar(scene, -20, -30);
    this.container = this.scene.add.container(this.x, this.y, this.hp);

    setTimeout(() => {
      this.anims.play('ufo-float', true);
    }, Math.floor(Math.random() * 500));

    this.velocity = 1000;

    this.findPath();

    this.setInteractive();

    this.on('pointerdown', (pointer) => {
      this.setTint(0xff4d4d);
      this.hp.decrease(20);
      setTimeout(() => {
        this.setTint(0xffffff)
      },200);
    });
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    this.container.x = this.x;
    this.container.y = this.y;

    if(this.alive && this.hp.value <= 0){
      this.explode()
    }
  }

  explode(){
    this.sfx.explode.play();
    this.alive = false;

    this.scene.tweens.killTweensOf(this);

    const particles = this.scene.add.particles('spark');

    const emitter = particles.createEmitter({
      "gravityY": -110,
      "maxParticles": 0,
      "angle": { "min": 0, "max": 360 },
      "alpha": { "start": 1, "end": 0, "ease": "Linear" },
      "lifespan": 900,
      "maxVelocityX": 200,
      "maxVelocityY": 200,
      "x": this.x,
      "y": this.y,
      "speed": 400,
      "scale": { "start": 0.6, "end": 0.4, "ease": "Linear" }
    });
    emitter.setBlendMode(Phaser.BlendModes.ADD);

    console.log(emitter)
    console.log(particles)

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
      x: { value: tile.x * this.scene.map.tileWidth + 32, duration: this.velocity },
      y: { value: tile.y * this.scene.map.tileHeight + 32, duration: this.velocity }
    }));

    this.scene.tweens.timeline({
      tweens: tweens
    });
  }

  findPath(){
    const toX = this.scene.map.width / 2;
    const toY = this.scene.map.height / 2;

    this.finder.findPath(this.x, this.y, toX, toY, (path) => {
      if (path === null) {
        console.warn("Path was not found.");
      } else {
        this.moveAlongPath(path);
      }
    });

    this.finder.calculate();
  }
}

const spawnOnMapEdge = (scene) => {

  // map edges are numbered 1 - 4 clockwise from top
  const edge = Math.ceil(Math.random() * 4);

  const edgeLength = edge % 2 === 0 ? scene.map.height : scene.map.width;
  const position = Math.floor(Math.random() * edgeLength);

  switch (edge) {
    case 1:
      return { x: position, y: 0 };
    case 2:
      return { x: scene.map.width - 1, y: position };
    case 3:
      return { x: position, y: scene.map.height - 1 };
    case 4:
      return { x: 0, y: position };
  }
};

export { UFO as default, spawnOnMapEdge };
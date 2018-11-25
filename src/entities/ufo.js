import Phaser from 'phaser';

class UFO extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y,  config.key);

    this.scene = scene;
    this.finder = this.scene.finder;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.anims.play('ufo-float', true);

    this.velocity = 1000;

    this.findPath();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
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

// TODO, add a healthbar: http://labs.phaser.io/edit.html?src=src\game%20objects\graphics\health%20bars%20demo.js

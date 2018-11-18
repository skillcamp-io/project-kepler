import Phaser from 'phaser';

class Cursor extends Phaser.GameObjects.Image {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.setOrigin(0, 0);

    scene.add.existing(this);
  }
}

export default Cursor;

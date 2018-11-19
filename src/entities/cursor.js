import Phaser from 'phaser';

class Cursor extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.setOrigin(0, 0);

    scene.add.existing(this);
  }

  changeCursorImage(texture) {
    this.setTexture(texture);
    this.setOrigin(0, 0);
    this.setAlpha(0.5);
  }

  resetCursor() {
    this.setTexture('cursor');
    this.setOrigin(0, 0);
    this.setAlpha(1);
  }
}

export default Cursor;

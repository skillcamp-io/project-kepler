import Phaser from 'phaser';

class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    this.setTexture('plant');
    this.setPosition(x, y);
  }

  preUpdate(time, delta) {}
}

export default Plant;
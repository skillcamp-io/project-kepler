import Phaser from 'phaser';

class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    // USE THE TEXTURE PLANT (FROM TITLE.JS)
    this.setTexture('plant');
    this.setPosition(x, y);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

  }
}

export default Plant;
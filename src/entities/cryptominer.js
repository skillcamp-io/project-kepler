import Phaser from 'phaser';

class CryptoMiner extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    // USE THE TEXTURE PLANT (FROM TITLE.JS)
    this.setTexture('cryptominer');
    this.setPosition(x, y);
    scene.add.existing(this);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

  }
}

export default CryptoMiner;

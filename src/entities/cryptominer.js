import Phaser from 'phaser';

class CryptoMiner extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.active = config.active;

    scene.add.existing(this);
  }
}

export default CryptoMiner;

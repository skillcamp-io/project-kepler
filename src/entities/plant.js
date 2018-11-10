import Phaser from 'phaser';

class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y , config) {
    super(scene, x, y , config.key);

    // USE THE TEXTURE PLANT (FROM TITLE.JS)
    this.setTexture('plant');
    this.setPosition(x, y);


    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(1);
    this.setCollideWorldBounds(true);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    this.body.setVelocity(0, 0);

  }
}

export default Plant;
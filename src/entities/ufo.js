import Phaser from 'phaser';

class UFO extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.anims.play('ufo-float', true);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

export default UFO;

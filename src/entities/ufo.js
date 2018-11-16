import Phaser from 'phaser';

class UFO extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    // this.scene = scene;
    this.anims.play('ufo-float', true);
    // this.vel = 200;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(1);
    this.setCollideWorldBounds(true);

    this.body.bounce = { x: 0.35, y: 0.5 };

    console.log(this);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

export default UFO;
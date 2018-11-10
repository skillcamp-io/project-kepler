import Phaser from 'phaser';

class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.scene = scene;

    this.animationName = 'player-back-walk'
    
    console.log(this.animationName)

    this.anims.play(this.animationName)

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(1);
    this.setCollideWorldBounds(true);

  }

  preUpdate(time, delta) {
  }
}

export default Plant;
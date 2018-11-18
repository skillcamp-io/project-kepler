import Phaser from 'phaser';

/**
 * The bullet class will be used as a base for all bullets from our towers.
 * They will be created in a group and reused to avoid memory leaks.
 */
class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

export default Bullet;

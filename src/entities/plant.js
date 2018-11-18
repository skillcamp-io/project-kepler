import Phaser from 'phaser';

class Plant extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }
}

export default Plant;

// TODO: http://labs.phaser.io/edit.html?src=src\game%20objects\graphics\health%20bars%20demo.js
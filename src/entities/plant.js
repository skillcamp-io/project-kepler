import Phaser from 'phaser';

class Plant extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.active = config.active;

    scene.add.existing(this);
  }

  // preUpdate(time, delta) {
  //   super.preUpdate(time, delta);
  // }
}

export default Plant;

// TODO, add a healthbar: http://labs.phaser.io/edit.html?src=src\game%20objects\graphics\health%20bars%20demo.js
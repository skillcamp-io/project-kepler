import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.scene = scene;
    this.lastAnim = null;
    this.vel = 200;

    this.play('player-idle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const {
      LEFT, RIGHT, UP, DOWN, W, S, A, D,
    } = Phaser.Input.Keyboard.KeyCodes;

    this.keys = this.scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      w: W,
      s: S,
      a: A,
      d: D,
    });

    this.setScale(1);
    this.setCollideWorldBounds(true);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    const {
      left, right, up, down, w, s, a, d,
    } = this.keys;

    let animationName = 'player-idle';

    this.body.setVelocity(0, 0);

    if (left.isDown || a.isDown) {
      this.body.setVelocityX(-this.vel);
      this.setFlipX(true);
    }

    if (right.isDown || d.isDown) {
      this.body.setVelocityX(this.vel);
      this.setFlipX(false);
    }

    if (up.isDown || w.isDown) {
      this.body.setVelocityY(-this.vel);
    }

    if (down.isDown || s.isDown) {
      this.body.setVelocityY(this.vel);
    }

    if (
      up.isDown || down.isDown || left.isDown || right.isDown
      || w.isDown || s.isDown || a.isDown || d.isDown
    ) {
      animationName = 'player-walk';
    } else {
      animationName = 'player-idle';
    }

    if (this.lastAnim !== animationName) {
      this.lastAnim = animationName;
      this.anims.play(animationName, true);
    }
  }
}

export default Player;

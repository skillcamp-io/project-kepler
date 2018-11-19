import Phaser from 'phaser';

class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.scene = scene;
    this.animationName = 'player-front-walk';
    this.vel = 400;
    this.sfx = {
      walk: new Audio('/assets/audio/footsteps.wav'),
    };

    this.sfx.walk.volume = 0.5;
    this.sfx.walk.loop = true;

    this.anims.play(this.animationName, true);

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setScale(1);
    this.setCollideWorldBounds(true);

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
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    const {
      left, right, up, down, w, s, a, d,
    } = this.keys;

    this.body.setVelocity(0, 0);

    if (left.isDown || a.isDown) {
      this.body.setVelocityX(-this.vel);
      this.setFlipX(true);
      this.animationName = 'player-side-walk';
      this.anims.play(this.animationName, true, 0);
      this.sfx.walk.play();
    } else if (right.isDown || d.isDown) {
      this.body.setVelocityX(this.vel);
      this.setFlipX(false);
      this.animationName = 'player-side-walk';
      this.anims.play(this.animationName, true, 0);
      this.sfx.walk.play();
    } else if (up.isDown || w.isDown) {
      this.body.setVelocityY(-this.vel);
      this.animationName = 'player-back-walk';
      this.anims.play(this.animationName, true, 0);
      this.sfx.walk.play();
    } else if (down.isDown || s.isDown) {
      this.body.setVelocityY(this.vel);
      this.animationName = 'player-front-walk';
      this.anims.play(this.animationName, true, 0);
      this.sfx.walk.play();
    } else if (this.anims.isPlaying) {
      this.anims.setProgress(0);
      this.anims.stop();
      this.sfx.walk.pause();
    }
  }
}

export default Player;

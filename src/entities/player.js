export default class Player extends Phaser.Physics.Arcade.Sprite{
   constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.scene = scene;
    this.lastAnim = null;
    this.vel = 200;

    this.play('player-idle');

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const { LEFT, RIGHT, UP, DOWN } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = this.scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
    });

    this.setScale(1.5);
    this.setCollideWorldBounds(true);
  }

  preUpdate (time, delta) {
    super.preUpdate(time, delta);

    const keys = this.keys;
    let animationName = 'player-idle';

    this.body.setVelocity(0, 0);

    if (keys.left.isDown) {
      this.body.setVelocityX(-this.vel);
      this.setFlipX(true);
    }

    if (keys.right.isDown) {
      this.body.setVelocityX(this.vel);
      this.setFlipX(false);
    }

    if (keys.up.isDown) {
      this.body.setVelocityY(-this.vel);
    }

    if (keys.down.isDown) {
      this.body.setVelocityY(this.vel);
    }

    // TODO: Clean this up, show idle after a while not immediately
    if (keys.up.isDown || keys.down.isDown || keys.left.isDown || keys.right.isDown) {
      animationName = "player-walk";
    } else {
      animationName = 'player-idle';
    }

    if(this.lastAnim !== animationName) {
      this.lastAnim = animationName;
      this.anims.play(animationName, true);
    }
  }
}

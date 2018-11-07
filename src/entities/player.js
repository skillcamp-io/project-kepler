export default class Player extends Phaser.GameObjects.Sprite{
   constructor(scene, x, y, config) {
    super(scene, x, y, config.key);

    this.scene = scene;
    this.lastAnim = null;

    // this.setTexture('player', 0);
    this.setPosition(x, y);

    const { LEFT, RIGHT, UP, DOWN, W, A, D, S } = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT || A,
      right: RIGHT || D,
      up: UP || W,
      down: DOWN || S,
    });
  }

  // This is handles updating the sprite
  preUpdate (time, delta) {
    super.preUpdate(time, delta);

    const keys = this.keys;
    let animationName = 'player-idle';

    if (keys.up.isDown || keys.down.isDown || keys.left.isDown || keys.right.isDown) {
      animationName = "player-walk";
    }

    if(this.lastAnim !== animationName) {
      this.lastAnim = animationName;
      this.anims.play(animationName, true);
    }

    // Apply horizontal acceleration when left/a or right/d are applied
    // if (keys.left.isDown || keys.a.isDown) {
    //   sprite.setAccelerationX(-acceleration);
    //   // No need to have a separate set of graphics for running to the left & to the right. Instead
    //   // we can just mirror the sprite.
    //   sprite.setFlipX(true);
    // } else if (keys.right.isDown || keys.d.isDown) {
    //   sprite.setAccelerationX(acceleration);
    //   sprite.setFlipX(false);
    // } else {
    //   sprite.setAccelerationX(0);
    // }

    // // Only allow the player to jump if they are on the ground
    // if (onGround && (keys.up.isDown || keys.w.isDown)) {
    //   sprite.setVelocityY(-500);
    // }

    // // Update the animation/texture based on the state of the player
    // if (onGround) {
    //   if (sprite.body.velocity.x !== 0) sprite.anims.play("player-run", true);
    //   else sprite.anims.play("player-idle", true);
    // } else {
    //   sprite.anims.stop();
    //   sprite.setTexture("player", 10);
    // }
  }
}

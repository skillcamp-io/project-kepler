import Phaser from 'phaser';
import Player from '../entities/player';

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.map = null;
  }

  create() {
    this.createAnimations();
    this.setUpMap();

    this.player = new Player(this, 0, 0, { key: 'player' });

    this.physics.add.collider(this.player, this.background_layer);

    this.setUpCamera();
  }

  // Create the animations we need from the player spritesheet
  // TODO: Move this to a preload scene
  createAnimations() {
    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 12 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-front-walk',
      frames: this.anims.generateFrameNumbers('player_front_walk', { start: 0, end: 7 }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-side-walk',
      frames: this.anims.generateFrameNumbers('player_side_walk', { start: 0, end: 7 }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-hurt',
      frames: this.anims.generateFrameNumbers('player_hurt', { start: 0, end: 3 }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-dead',
      frames: this.anims.generateFrameNumbers('player_dead', { start: 0, end: 6 }),
      frameRate: 14,
      repeat: -1,
    });
  }

  setUpMap() {
    this.map = this.make.tilemap({ key: 'map' });
    const tiles = this.map.addTilesetImage('scifi_tilesheet', 'scifi_tilesheet_img', 64, 64, 1, 2);

    this.background_layer = this.map.createStaticLayer('background_layer', tiles, 0, 0);
    // this.map.setCollisionBetween(20, 39);
    this.map.setCollisionByProperty({ collidable: true });
  }

  setUpCamera() {
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

    this.cameras.main.startFollow(this.player, true, 0.8, 0.8);
  }
}

export default GameScene;

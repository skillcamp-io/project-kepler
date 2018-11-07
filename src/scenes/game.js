import 'phaser';
import Player from '../entities/player';

export class GameScene extends Phaser.Scene {
  map = null;
  controls = null;
  widthHeight = 64;

  // TODO: Move this to a preload scene
  preload() {
    this.scene = this;
    this.load.spritesheet('scifi_tilesheet_img', 'assets/tilemaps/scifi_tilesheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/scifimap.json');

    // TODO: Make this one single atlas
    this.load.spritesheet('player_idle', 'assets/spritesheets/player_idle.png', { frameWidth: 19, frameHeight: 21 });
    this.load.spritesheet('player_walk', 'assets/spritesheets/player_walk.png', { frameWidth: 18, frameHeight: 20 });
  }

  create() {
    this.createAnimations();
    this.setUpMap();

    this.player = new Player(this, 0, 0, {key: 'player'});

    this.physics.add.collider(this.player, this.background_layer);

    this.setUpCamera();
  }

  // Create the animations we need from the player spritesheet
  // TODO: Move this to a preload scene
  createAnimations() {
    this.anims.create({
      key: "player-idle",
      frames: this.anims.generateFrameNumbers("player_idle", { start: 0, end: 12 }),
      frameRate: 6,
      repeat: -1
    });

    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player_walk", { start: 0, end: 7 }),
      frameRate: 14,
      repeat: -1
    });
  }

  setUpMap() {
    this.map = this.make.tilemap({ key: 'map' });
    var tiles = this.map.addTilesetImage('scifi_tilesheet', 'scifi_tilesheet_img');

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

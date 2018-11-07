import 'phaser';
import EasyStar from 'easystarjs';

import { Building } from '../entities/building';
import Player from '../entities/player';

export class GameScene extends Phaser.Scene {
  map = null;
  controls = null;
  widthHeight = 64;

  // TODO: Move this to a preload scene
  preload() {
    this.scene = this;
    this.load.spritesheet('scifi_tilesheet_img', 'assets/tilemaps/scifi_tilesheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.atlasJSONHash('player', 'assets/spritesheets/player.png', 'assets/spritesheets/player.json');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/scifimap.json');
  }

  create() {
    this.createAnimations();

    this.player = new Player(this, 300, 300, {key: 'player'});
    this.add.existing(this.player);

    this.setUpMap();
    this.setUpCamera();
  }

  // Create the animations we need from the player spritesheet
  // TODO: Move this to a preload scene
  createAnimations() {
    this.anims.create({
      key: "player-idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 12 }),
      frameRate: 3,
      repeat: -1
    });

    this.anims.create({
      key: "player-walk",
      frames: this.anims.generateFrameNumbers("player", { start: 19, end: 20 }),
      frameRate: 3,
      repeat: -1
    });
  }

  setUpMap() {
    // this.map = this.make.tilemap({ key: 'map' });
    // var tiles = this.map.addTilesetImage('scifi_tilesheet', 'scifi_tilesheet_img');
    // this.map.createStaticLayer('background_layer', tiles, 0, 0);
  }

  setUpCamera() {
    this.cameras.main
        .setZoom(3);

    var cursors = this.input.keyboard.createCursorKeys();
    var controlConfig = {
        camera: this.cameras.main,
        left: cursors.left,
        right: cursors.right,
        up: cursors.up,
        down: cursors.down,
        speed: 0.5
    };

    this.cameraControls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    this.cameras.main.startFollow(this.player);
  }

  update (time, delta) {
    this.cameraControls.update(delta);
  }
}

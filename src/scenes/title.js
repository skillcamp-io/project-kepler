import Phaser from 'phaser';

class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {
    this.load.spritesheet('scifi_tilesheet_img', 'assets/tilemaps/scifi_tilesheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/scifimap.json');
    this.load.spritesheet('player_idle', 'assets/spritesheets/astro_idle.png', { frameWidth: 39, frameHeight: 50 });
    this.load.spritesheet('player_side_walk', 'assets/spritesheets/astro_side.png', { frameWidth: 36.5, frameHeight: 50 });
    this.load.spritesheet('player_front_walk', 'assets/spritesheets/astro_forward.png', { frameWidth: 41.8, frameHeight: 50 });
    this.load.spritesheet('player_back_walk', 'assets/spritesheets/astro_backward.png', { frameWidth: 41.8, frameHeight: 50 });
    this.load.spritesheet('player_dead', 'assets/spritesheets/player_dead.png', { frameWidth: 21, frameHeight: 20 });
    this.load.spritesheet('player_hurt', 'assets/spritesheets/player_hurt.png', { frameWidth: 20, frameHeight: 20 });
    this.load.image('plant','../../assets/spritesheets/Bush.png')


  }

  create() {
    this.scene.start('GameScene');
  }
}

export default TitleScene;

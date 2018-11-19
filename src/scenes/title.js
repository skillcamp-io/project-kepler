import Phaser from 'phaser';

class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  preload() {
    this.load.spritesheet('scifi_tilesheet_img', 'assets/tilemaps/scifi_tilesheet.png', { frameWidth: 64, frameHeight: 64 });
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/scifimap.json');
    this.load.spritesheet('player_idle', 'assets/spritesheets/astro_idle.png', { frameWidth: 39, frameHeight: 50 });
    this.load.spritesheet('ufo', 'assets/spritesheets/ufo.png', { frameWidth: 50, frameHeight: 60 });
    this.load.spritesheet('player_side_walk', 'assets/spritesheets/astro_side.png', { frameWidth: 36.5, frameHeight: 50 });
    this.load.spritesheet('player_front_walk', 'assets/spritesheets/astro_forward.png', { frameWidth: 41.8, frameHeight: 50 });
    this.load.spritesheet('player_back_walk', 'assets/spritesheets/astro_backward.png', { frameWidth: 41.8, frameHeight: 50 });
    this.load.image('plant', '../../assets/spritesheets/bush_small.png');
    this.load.image('cursor', '../../assets/spritesheets/cursor.png');
  }

  create() {
    this.scene.start('GameScene');

    // Game start, show UI
    const gameUI = document.querySelector('.game-ui');
    gameUI.classList.remove('hidden');
  }
}

export default TitleScene;

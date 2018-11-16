import Phaser from 'phaser';

import 'normalize.css';
import 'spectre.css';

import './less/main.less';

import GameScene from './scenes/game';
import TitleScene from './scenes/title';

const gameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scene: [TitleScene, GameScene],
  pixelArt: true,
  zoom: 2,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true,
    },
  },
};

// eslint-disable-next-line no-new
new Phaser.Game(gameConfig);

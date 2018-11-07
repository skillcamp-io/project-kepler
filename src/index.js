import 'phaser';

import 'normalize.css';
import 'spectre.css';

import './less/main.less';

import { GameScene } from './scenes/game';

const gameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  scene: GameScene,
  pixelArt: true,
  zoom: 2,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 0 },
        debug: false
    }
  },
};

new Phaser.Game(gameConfig);

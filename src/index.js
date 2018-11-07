import 'phaser';

import 'normalize.css';
import 'spectre.css';

import './less/main.less';

import { GameScene } from './scenes/game';

const gameConfig = {
  width: 1024,
  height: 768,
  scene: GameScene
};

new Phaser.Game(gameConfig);

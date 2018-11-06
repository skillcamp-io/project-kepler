import 'phaser';

import 'normalize.css';
import 'spectre.css';

import './less/main.less';

import { MapScene } from './scenes/map';

const gameConfig = {
  width: 1024,
  height: 768,
  scene: MapScene
};

new Phaser.Game(gameConfig);

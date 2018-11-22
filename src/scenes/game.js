import Phaser from 'phaser';

import $ from 'cash-dom';

import Player from '../entities/player';
import UFO from '../entities/ufo';
import Cursor from '../entities/cursor';
import Plant from '../entities/plant';

const AVAILABLE_UNITS = {
  plant_1: 'plant',
  plant_2: 'plant',
  plant_3: 'plant',
  plant_4: 'plant',
};

const TIME_BETWEEN_WAVES = 60 * 2 * 1000; // 60 seconds, times 2, times 1000 milliseconds

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene',
    });

    // This will be the Tiled map with the background
    this.map = null;

    // Here we will hold a reference to the position in the map and what object is there.
    // ie: { x_y: Plant}
    // We'll use the x and y coords as the index as it's faster to search for
    // Make sure that this is cleaned when a plant is destroyed, easy way for memory to leak here
    this.unitsBuilt = {};

    // Track which unit we're going to build
    this.unitToBuild = null;

    // Current mode (building: true, fighting: false)
    this.currentlyBuilding = true;

    console.log(this);
  }

  preload() {
    this.createAnimations();
  }

  create() {
    this.setUpMap();

    this.createEnemyGroup(30);
    this.createPlantGroup(30);

    this.setUpPlayer();

    this.setUpCamera();

    this.setUpEventListeners();

    this.setUpCursor();

    this.setUpWaveTimer();
  }

  update() {
    this.physics.world.collide(this.player, this.plantGroup);
    this.physics.world.collide(this.player, this.ufo);
    this.physics.world.collide(this.ufo, this.plantGroup);
    this.physics.world.collide(this.ufo, this.ufo);

    this.handleCursor();
    this.handleTimerText();
  }

  setUpEventListeners() {
    /**
     * When we receive the "build" event, check that the type is available and change the cursor to it so we're ready to place
     */
    $(document).on('build_unit', (e) => {
      const unitType = e.data.type;

      if (AVAILABLE_UNITS.hasOwnProperty(unitType)) {
        this.cursor.changeCursorImage(AVAILABLE_UNITS[unitType]);

        // Set the unit we are going to build
        this.unitToBuild = AVAILABLE_UNITS[unitType];
      }
    });

    // When we cancel building, reset the cursor image and alpha
    $(document).on('build_unit_canceled', () => {
      this.cursor.resetCursor();
      this.unitToBuild = null;
    });
  }

  handleCursor() {
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    const pointerTileX = this.map.worldToTileX(worldPoint.x);
    const pointerTileY = this.map.worldToTileY(worldPoint.y);

    // Snap to tile coordinates, but in world space
    this.cursor.x = this.map.tileToWorldX(pointerTileX);
    this.cursor.y = this.map.tileToWorldY(pointerTileY);

    if (this.input.manager.activePointer.justUp) {
      this.handleGameClick(this.cursor.x, this.cursor.y);
    }
  }

  // TODO: Make sure that we can add our units where we clicked, use this to verify
  checkCollision(x, y) {
    const tile = this.map.getTileAt(x, y);
    return tile.properties.collide === true;
  }

  setUpPlayer() {
    this.player = new Player(this, 100, 100, {
      key: 'player',
    });

    this.physics.add.collider(this.player, this.background_layer);
    this.physics.add.collider(this.plantGroup, this.background_layer);
    this.physics.add.collider(this.ufo, this.background_layer);
  }

  setUpMap() {
    this.map = this.make.tilemap({
      key: 'map',
    });

    const tiles = this.map.addTilesetImage('scifi_tilesheet', 'scifi_tilesheet_img', 64, 64, 1, 2);

    this.background_layer = this.map.createStaticLayer('background_layer', tiles, 0, 0);

    // this.map.setCollisionBetween(20, 39);
    this.map.setCollisionByProperty({
      collidable: true,
    });
  }

  setUpCamera() {
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.8, 0.8);
  }

  setUpCursor() {
    this.cursor = new Cursor(this, 0, 0, {
      key: 'cursor',
    });
  }

  createEnemyGroup(numberOfEnemies) {
    this.ufo = this.physics.add.group();
    
    // TODO: Enable this again, add them randomly and move to the center. Use A* pathfinding (see initial commits), not random bouncing
    /*
    for (let i = 1; i < numberOfEnemies; i++) {
      const childUFO = new UFO(this, i * 200, 200, {
        key: 'ufo_enemy',
      });

      this.ufo.add(childUFO);

      childUFO.setBounce(1);
      childUFO.setCollideWorldBounds(true);
      childUFO.setVelocity((Math.random() - 0.5) * 400 + 300, (Math.random() - 0.5) * 400 + 300);
    }

    Phaser.Actions.RandomRectangle(
      this.ufo.getChildren(),
      new Phaser.Geom.Rectangle(100, 100, 1600, 1600), // (x, y, width, height)
    );
    */
  }

  createPlantGroup(numberOfPlants) {
    this.plantGroup = this.add.group();

    for (let i = 0; i < numberOfPlants; i++) {
      const plantObj = new Plant(this, 0, 0, { key: 'plant', active: false });
      this.plantGroup.add(plantObj);
    }

    // TODO: Use createMultiple but with our custom Plant class
  }

  storeBuiltUnit(x, y, item) {
    const coord = `${x}_${y}`;
    this.unitsBuilt[coord] = item;
  }

  handleGameClick(x, y) {
    const coord = `${x}_${y}`;

    //TODO: Make this prettier
    if (!this.currentlyBuilding) {
      alert('You should be fighting!');
      return false;
    }

    if (this.unitToBuild !== null && !this.unitsBuilt.hasOwnProperty(coord)) {

      // TODO: Here we will build different type of units depending on the type (this.unitToBuild)
      const alien = this.plantGroup.get(x + this.map.tileWidth / 2, y + this.map.tileHeight / 2);
      alien.setActive(true).setVisible(true);

      this.storeBuiltUnit(x, y, alien);

      console.log(this.unitsBuilt);

      // After building, reset the cursor and disable the building finished
      // TODO: Or not?
      // this.cursor.resetCursor();
      // this.unitToBuild = null;
    }
  }

  setUpWaveTimer() {
    this.text = this.add.text(32, 32);
    this.timedEvent = this.time.addEvent({
      delay: TIME_BETWEEN_WAVES,
      callback: this.timerCallback,
      callbackScope: this,
      loop: true,
    });

    this.gameModeText = this.add.text(this.cameras.main.width - 50, 32);
    this.gameModeText.setText('Building');
  }

  timerCallback() {
    console.log('TIMER!');
    this.currentlyBuilding = !this.currentlyBuilding;
  }

  handleTimerText() {
    const millis = TIME_BETWEEN_WAVES - (this.timedEvent.getElapsedSeconds().toFixed(0) * 1000);
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    const padding = seconds < 10 ? '0' : '';
    const str = `${minutes}:${padding}${seconds}`;

    this.text.setText(`Time to next wave: ${str}`);
  }

  createAnimations() {
    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: 0,
        end: 12,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'ufo-float',
      frames: this.anims.generateFrameNumbers('ufo', {
        start: 0,
        end: 15,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-front-walk',
      frames: this.anims.generateFrameNumbers('player_front_walk', {
        start: 0,
        end: 7,
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-back-walk',
      frames: this.anims.generateFrameNumbers('player_back_walk', {
        start: 0,
        end: 7,
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-side-walk',
      frames: this.anims.generateFrameNumbers('player_side_walk', {
        start: 0,
        end: 7,
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-hurt',
      frames: this.anims.generateFrameNumbers('player_hurt', {
        start: 0,
        end: 3,
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-dead',
      frames: this.anims.generateFrameNumbers('player_dead', {
        start: 0,
        end: 6,
      }),
      frameRate: 14,
      repeat: -1,
    });
  }
}

export default GameScene;

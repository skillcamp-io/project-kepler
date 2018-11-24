import Phaser from 'phaser';
import $ from 'cash-dom';
import EasyStar from "easystarjs";

import Player from '../entities/player';
import UFO from '../entities/ufo';
import CryptoMiner from '../entities/cryptominer';
import Cursor from '../entities/cursor';
import Plant from '../entities/plant';


const AVAILABLE_UNITS = {
  plant: 'plant',
  miner: 'cryptominer',
  plant_3: 'plant',
  plant_4: 'plant',
};

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
  }

  preload() {
    this.createAnimations();
  }

  create() {
    // TODO: Figure out a way to clean this up. Or maybe this is the best way to initialize everything?

    // Create World
    this.setUpMap();
    this.setUpPlayer();
    this.setUpCamera();
    this.setUpEventListeners();
    this.setUpCursor();
    // this.setUpPathFinder();


    // Create Entities
    // this.createEnemyGroup(2);
    // this.createPlantGroup(2);
    // this.createCryptominerGroup(2);
  }

  update() {
    this.physics.world.collide(this.player, this.plantGroup);
    this.physics.world.collide(this.player, this.ufo);
    this.physics.world.collide(this.ufo, this.plantGroup);
    this.physics.world.collide(this.ufo, this.ufo);

    this.handleCursor();
  }

  setUpEventListeners() {
    /**
     * When we receive the "build" event, check that the type is available and change the cursor to it so we're ready to place
     */
    $(document).on('build_unit', (e) => {
      const unitType = e.data.type;

      if (AVAILABLE_UNITS.hasOwnProperty(unitType)) {
        this.cursor.changeCursorImage(AVAILABLE_UNITS[unitType]);
        this.cursor.setVisible(true);

        // Set the unit we are going to build
        this.unitToBuild = AVAILABLE_UNITS[unitType];
      }
    });

    /**
     * When we cancel building, reset the cursor image and alpha
     */
    $(document).on('build_unit_canceled', () => {
      this.cursor.resetCursor();
      this.cursor.setVisible(false);
      this.unitToBuild = null;
    });

    /**
     * When the wave is finished, toggle state, build enemies, etc
     */
    $(document).on('wave_timer_finished', () => {
      this.currentlyBuilding = !this.currentlyBuilding;

      if (!this.currentlyBuilding) {
        // FIGHT!

        // TODO: When all enemies are dead, or manually triggered, or just loop?
        // $(document).trigger('start_wave_countdown');
      }
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

    if (this.input.manager.activePointer.justUp && !this.checkCollision(pointerTileX, pointerTileY)) {
      this.handleGameClick(this.cursor.x, this.cursor.y);
    }
  }

  checkCollision(x, y) {
    const tile = this.map.getTileAt(x, y);
    return tile.properties.collidable === true;
  }

  setUpPlayer() {
    this.player = new Player(this, 15 * 64, 15 * 64, {
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

    this.background_layer = this.map.createStaticLayer('walkable_layer', tiles, 0, 0);

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
    // Create an empty cursor, we'll use this when building units
    this.cursor = new Cursor(this, 0, 0, {
      key: 'cursor_pointer',
    });

    this.cursor.setVisible(false);
    this.input.setDefaultCursor('url(assets/spritesheets/cursor_pointer.png), pointer');
  }

  createEnemyGroup(numberOfEnemies) {
    this.ufo = this.physics.add.group();

    for (let i = 1; i < numberOfEnemies; i++) {
      const childUFO = new UFO(this, 0, 0, {
        key: 'ufo_enemy',
      });

      this.ufo.add(childUFO);

      childUFO.setBounce(1);
    }
  }

  createPlantGroup(numberOfPlants) {
    this.plantGroup = this.add.group();

    for (let i = 0; i < numberOfPlants; i++) {
      const plantObj = new Plant(this, 0, 0, {key: 'plant', active: false});
      this.plantGroup.add(plantObj);
    }
  }

  createCryptominerGroup(numberOfMiners) {
    this.minerGroup = this.add.group();

    for (let i = 0; i < numberOfMiners; i++) {
      const plantObj = new CryptoMiner(this, 0, 0, {key: 'cryptominer', active: false});
      this.minerGroup.add(plantObj);
    }
  };

  storeBuiltUnit(x, y, item) {
    const coord = `${x}_${y}`;
    this.unitsBuilt[coord] = item;
  }

  handleGameClick(x, y) {
    const coord = `${x}_${y}`;

    // TODO: Make this prettier
    if (!this.currentlyBuilding) {
      alert('You should be fighting!');
      return false;
    }

    if (this.unitToBuild !== null && !this.unitsBuilt.hasOwnProperty(coord)) {
      let newUnit = null;

      const xPos = x + this.map.tileWidth / 2;
      const yPos = y + this.map.tileHeight / 2;

      switch (this.unitToBuild) {
        case 'plant':
          newUnit = this.plantGroup.get(xPos, yPos);
          break;
        case 'cryptominer':
          newUnit = this.minerGroup.get(xPos, yPos);
          break;
        default:
          break;
      }

      if (newUnit) {
        newUnit.setActive(true).setVisible(true);
        this.storeBuiltUnit(x, y, newUnit);
      }

      // After building, reset the cursor and disable the building finished
      // TODO: Or not?
      // this.cursor.resetCursor();
      // this.unitToBuild = null;
    }
  }

  setUpPathFinder() {
    const createGrid = () => {
      const grid = [];
      for (let y = 0; y < this.map.height; y++) {
        const col = [];
        for (let x = 0; x < this.map.width; x++) {
          const tile = this.map.getTileAt(x, y);
          col.push(tile.index);
        }
        grid.push(col);
      }
      return grid
    }

    const findAcceptableTiles= () => {
      const tileset = this.map.tilesets[0];
      const properties = tileset.tileProperties;
      const acceptableTiles = [];

      // "firstgid" is property given by Tiled as the first index
      for(let i = tileset.firstgid - 1; i < tileset.total; i++){
        if(!properties.hasOwnProperty(i) || !properties[i].collidable) {
          acceptableTiles.push(i + 1);
        }
      }
      return acceptableTiles
    }

    this.finder = new EasyStar.js();
    this.finder.setGrid(createGrid());
    this.finder.setAcceptableTiles(findAcceptableTiles());
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

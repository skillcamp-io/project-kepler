import Phaser from 'phaser';
import Player from '../entities/player';
import UFO from '../entities/ufo';
import Plant from '../entities/plant';

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    });
    this.map = null;
  }

  preload() {
    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNumbers('player_idle', {
        start: 0,
        end: 12
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'ufo-float',
      frames: this.anims.generateFrameNumbers('ufo', {
        start: 0,
        end: 15
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-front-walk',
      frames: this.anims.generateFrameNumbers('player_front_walk', {
        start: 0,
        end: 7
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-back-walk',
      frames: this.anims.generateFrameNumbers('player_back_walk', {
        start: 0,
        end: 7
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-side-walk',
      frames: this.anims.generateFrameNumbers('player_side_walk', {
        start: 0,
        end: 7
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-hurt',
      frames: this.anims.generateFrameNumbers('player_hurt', {
        start: 0,
        end: 3
      }),
      frameRate: 14,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-dead',
      frames: this.anims.generateFrameNumbers('player_dead', {
        start: 0,
        end: 6
      }),
      frameRate: 14,
      repeat: -1,
    });

    
  }
  create() {
    this.setUpMap();

    this.createEnemyGroup(30);

    this.createPlantGroup(30);
    
    this.player = new Player(this, 100, 100, {
      key: 'player'
    });

    this.physics.add.collider(this.player, this.background_layer);
    this.physics.add.collider(this.plant, this.background_layer);
    this.physics.add.collider(this.ufo, this.background_layer);

    this.setUpCamera();

  }

  update(){
    this.physics.world.collide(this.player, this.plant);
    this.physics.world.collide(this.player, this.ufo);
    this.physics.world.collide(this.ufo, this.plant);
    this.physics.world.collide(this.ufo, this.ufo);
  }

  setUpMap() {
    this.map = this.make.tilemap({
      key: 'map'
    });

    const tiles = this.map.addTilesetImage('scifi_tilesheet', 'scifi_tilesheet_img', 64, 64, 1, 2);

    this.background_layer = this.map.createStaticLayer('background_layer', tiles, 0, 0);

    // this.map.setCollisionBetween(20, 39);
    this.map.setCollisionByProperty({
      collidable: true
    });
  }

  setUpCamera() {
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.8, 0.8);
  }

  createEnemyGroup(numberOfEnemies) {
    this.ufo = this.physics.add.group();

    for( let i = 1; i < numberOfEnemies ; i++){
      const childUFO = new UFO(this, i * 200, 200, {
        key: `ufo_emeny`
      });

      this.ufo.add(childUFO);

      childUFO.setBounce(1);
      childUFO.setCollideWorldBounds(true);
      childUFO.setVelocity((Math.random() - 0.5) * 400 + 300, (Math.random() - 0.5) * 400 + 300);
    }

    Phaser.Actions.RandomRectangle(
      this.ufo.getChildren(),
      new Phaser.Geom.Rectangle(100, 100, 1600, 1600) // (x, y, width, height)
    )
  }

  createPlantGroup(numberOfPlants) {
    this.plant = this.physics.add.group({
      key: 'plant',
      frameQuantity: numberOfPlants, // number of plants
      immovable: true
    });


    // place plants randomly in rectangle
    Phaser.Actions.RandomRectangle(
      this.plant.getChildren(),
      new Phaser.Geom.Rectangle(100, 100, 1800, 1800) // (x, y, width, height)
    )
  }
}

export default GameScene;
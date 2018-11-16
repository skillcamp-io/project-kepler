import Phaser from 'phaser';
import Player from '../entities/player';
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

    this.plant = this.physics.add.group({
      key: 'plant',
      frameQuantity: 20, // number of plants
      immovable: true
    });

    // place plants randomly in rectangle
    Phaser.Actions.RandomRectangle(
      this.plant.getChildren(),
      new Phaser.Geom.Rectangle(700, 500, 500, 500) // (x, y, width, height)
    )

    // this.plant = new Plant(this, 350, 450, {
    //   key: 'plant-group'
    // })
    //
    // this.add.existing(this.plant);
    
    this.player = new Player(this, 100, 100, {
      key: 'player'
    });

    this.physics.add.collider(this.player, this.background_layer);
    this.physics.add.collider(this.plant, this.background_layer);

    this.setUpCamera();

  }

  update(){
    this.physics.world.collide(this.player, this.plant);
    this.physics.world.collide(this.plant, this.plant);
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
}

export default GameScene;
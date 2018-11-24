import Phaser from 'phaser';

class UFO extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, finder, config) {
    super(scene, x, y, finder, config.key);

    this.anims.play('ufo-float', true);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.spawnOnMapEdge();
    // this.findPath();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
  }

  // moveAlongPath(path){
  //   // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
  //   var tweens = [];
  //   for(var i = 0; i < path.length-1; i++){
  //     var ex = path[i+1].x;
  //     var ey = path[i+1].y;
  //     tweens.push({
  //       targets: this.player,
  //       x: {value: ex*this.map.tileWidth + 32, duration: 200},
  //       y: {value: ey*this.map.tileHeight + 32, duration: 200}
  //     });
  //   }
  //
  //   this.scene.tweens.timeline({
  //     tweens: tweens
  //   });
  // }

  // findPath(){
  //   const toX = this.map.width / 2;
  //   const toY = this.map.height / 2;
  //
  //   console.log(`going from (${ this.x },${ this.y }) to (${ toX },${ toY })`);
  //
  //   this.finder.findPath(this.x, this.y, toX, toY, (path) => {
  //     if (path === null) {
  //       console.warn("Path was not found.");
  //     } else {
  //       console.log(path);
  //       // this.moveAlongPath(path);
  //     }
  //   });
  //
  //   this.finder.calculate();
  // }

  spawnOnMapEdge () {
    let spawn = {};

    // map edges are numbered 1 - 4 clockwise from top
    const edge = Math.ceil(Math.random() * 4);

    console.log(this)


    // const edgeLength = edge % 2 === 0 ? this.map.height : this.map.width;
    // const position = Math.floor(Math.random() * edgeLength);

    // switch (edge) {
    //   case 1:
    //     spawn = { x: position, y: 0 };
    //     break;
    //   case 2:
    //     spawn = { x: this.map.width, y: position };
    //     break;
    //   case 3:
    //     spawn = { x: position, y: this.map.height };
    //     break;
    //   case 4:
    //     spawn = { x: 0, y: position };
    // }
    //
    // this.x = spawn.x;
    // this.y = spawn.y;
  }
}

export default UFO;

// TODO, add a healthbar: http://labs.phaser.io/edit.html?src=src\game%20objects\graphics\health%20bars%20demo.js

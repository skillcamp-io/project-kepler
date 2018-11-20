import Phaser from 'phaser';

class Ship extends Phaser.Physics.Arcade.Sprite {
	constructor (scene, x, y, config) {
		super(scene, x, y, config.key);

		// Use the ship texture from title.js
		this.setTexture('ship');
		this.setPosition(x, y);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
	}
}

export default Ship;

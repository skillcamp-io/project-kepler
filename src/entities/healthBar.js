class HealthBar extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y) {
    super(scene);

    this.x = x;
    this.y = y;
    this.value = 100;
    this.p = 76/100;

    this.draw();

    this.visible = false;
    setTimeout(() => { this.visible = true; }, 1500);

    scene.add.existing(this);
  }

  decrease (amount) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();
    return (this.value === 0);
  }

  draw () {
    this.clear();

    //  BG
    this.fillStyle(0x000000);
    this.fillRect(this.x, this.y, 80, 16);

    //  Health
    this.fillStyle(0xffffff);
    this.fillRect(this.x + 2, this.y + 2, 76, 12);

    if (this.value < 30) {
      this.fillStyle(0xff0000);
    } else {
      this.fillStyle(0x00ff00);
    }

    const damage = Math.floor(this.p * this.value);
    this.fillRect(this.x + 2, this.y + 2, damage, 12);
  }

}

export default HealthBar
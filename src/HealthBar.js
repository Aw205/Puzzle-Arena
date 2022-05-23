class HealthBar extends Phaser.GameObjects.Graphics{


    constructor(scene){

        super(scene);
        this.value = 100;
        this.draw();

        this.scene.add.existing(this);
        
    }

    decrease(amount){

        this.value -=amount;
        if (this.value < 0) {
            this.value = 0;
        }
        this.draw();

    }

    draw(){

        this.clear();
        this.fillStyle(0x000000);
        this.fillRect(this.x, this.y, 80, 16);

        this.fillStyle(0x50C878);
        this.fillRect(this.x + 2, this.y + 2, 76, 12);

        if (this.value < 30) {
            this.fillStyle(0xff0000);
        }
        else {
            this.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.value);
        this.fillRect(this.x + 2, this.y + 2, d, 12);

    }




}
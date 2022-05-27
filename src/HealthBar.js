class HealthBar extends Phaser.GameObjects.Graphics{


    constructor(scene,options){

        super(scene,options);

        this.colors = {green: 0x00ff00, red: 0xff0000, black: 0x000000, white: 0xffffff};
        this.value = 100;
        
        this.health_text = new Phaser.GameObjects.Text(this.scene,this.x+2,this.y+17,"100/100");
        this.health_text.setColor("#000000");
       
        this.draw();
        this.scene.add.existing(this);
        this.scene.add.existing(this.health_text);

    }

    decrease(amount){

        this.value -=amount;
        if (this.value < 0) {
            this.value = 0;
        }
        this.health_text.setText(this.value.toString() + "/100");
        this.draw();

    }

    draw(){

        this.clear();
        this.fillStyle(this.colors["black"]); // border 
        this.fillRect(this.x, this.y, 80, 16);

        this.fillStyle(this.colors["white"]); //background
        this.fillRect(this.x + 2, this.y + 2, 76, 12);

        let healthColor = (this.value < 30) ? this.colors["red"] : this.colors["green"];
        this.fillStyle(healthColor);

        var d = Math.floor(0.76 * this.value);
        this.fillRect(this.x + 2, this.y + 2, d, 12);

    }




}
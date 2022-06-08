class HealthBar extends Phaser.GameObjects.Graphics{


    constructor(scene,options,width,maxHealth){

        super(scene,options);

        this.colors = {green: 0x00ff00, red: 0xff0000, yellow: 0xFFBF00, black: 0x000000, white: 0xffffff};
        this.width = width;
        this.maxHealth = maxHealth;
        this.value = maxHealth;
        
        this.health_text = new Phaser.GameObjects.Text(this.scene,this.x+2,this.y+17,this.maxHealth + "/" + this.maxHealth);
        this.health_text.setColor("#000000");
       
        this.draw();
        this.scene.add.existing(this);
        this.scene.add.existing(this.health_text);

    }

    decrease(amount){

        this.value -=amount;
        if (this.value <= 0) {
            this.value = 0;
        }
        this.health_text.setText(this.value.toString() + "/" + this.maxHealth);
        this.draw();

    }

    draw(){

        this.clear();
        this.fillStyle(this.colors["black"]); // border 
        this.fillRect(0, 0, this.width, 16);

        this.fillStyle(this.colors["white"]); //background
        this.fillRect(2, 2, this.width-4, 12);

       
        let healthColor = (this.value < this.maxHealth/3) ? this.colors["red"] : this.colors["green"];
        if(this.value <= this.maxHealth/2 && this.value > this.maxHealth/3 ){
            healthColor = this.colors["yellow"];
        }
        this.fillStyle(healthColor);

        let d = Math.floor((this.width-4) * (this.value/this.maxHealth));
        this.fillRect(2,2, d, 12);

    }




}
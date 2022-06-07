class credits_screen extends Phaser.Scene{


    constructor(){
        super("credits_screen");
    }

    create(){

       this.add.image(game.config.width/2,game.config.height/2,"credits_background");
       this.returnButton = new TextButton(this,game.config.width/2,430,"Return",{fontSize: 28},()=> this.scene.start("Menu")).setOrigin(0.5);

    }

}
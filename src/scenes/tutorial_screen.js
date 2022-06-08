class tutorial_screen extends Phaser.Scene{


    constructor(){
        super("tutorial_screen");

    }

    create(){

        this.add.image(game.config.width/2,game.config.height/2,"tutorial_background");
        this.returnButton = new TextButton(this,580,20,"Return",{fontSize: 25},()=> this.scene.start("Menu")).setOrigin(0.5);
        this.add.sprite(179,225,null).play("pink_idle").setScale(1.5,1.5);
        this.add.sprite(410,280,null).play({key: "pink_swallow", repeat: -1, repeatDelay: 1000}).setScale(1.5,1.5);
    }

}
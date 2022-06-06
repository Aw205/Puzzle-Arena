
class victory_screen extends Phaser.Scene{

    constructor(){
        super("victory_screen");

    }

    preload(){

       

    }

    create(){
        this.cameras.main.fadeIn(1000);
        //this.add.image(game.config.width/2,game.config.height/2,"elemental").setScale(40,40).setOrigin(0.5,0.5);
        this.add.text(game.config.width/2,110,"Victory!").setOrigin(0.5).setFontSize(30).setColor("#FF0000");
        const restartButton = new TextButton(this,game.config.width/2-10,210,"Restart",{fontSize: 30},()=> this.scene.switch("game_screen")).setOrigin(0.5);
        const menuButton = new TextButton(this,game.config.width/2-10,260,"Menu",{fontSize: 30},()=> this.scene.switch("Menu")).setOrigin(0.5);

    }


}
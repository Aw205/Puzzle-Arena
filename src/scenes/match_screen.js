class match_screen extends Phaser.Scene{

    constructor(){
        super("match_screen");

    }

    preload(){

        this.load.image("fire","./assets/orbs/Fire.png");
        this.load.image("water","./assets/orbs/Water.png");
        this.load.image("wood","./assets/orbs/Wood.png");
        this.load.image("dark","./assets/orbs/Dark.png");
        this.load.image("light","./assets/orbs/Light.png");

    }

    create(){

        this.board = new Board(this,100,100);
    
    }


}
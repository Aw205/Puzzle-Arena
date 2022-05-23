class match_screen extends Phaser.Scene{

    constructor(){
        super("match_screen");

    }

    preload(){

        this.load.image("board_background","./assets/board_background.png");

         this.load.image("fire","./assets/orbs/Fire.png");
        this.load.image("water","./assets/orbs/Water.png");
        this.load.image("wood","./assets/orbs/Wood.png");
        this.load.image("dark","./assets/orbs/Dark.png");
        this.load.image("light","./assets/orbs/Light.png"); 

       /*  this.load.image("fire","./assets/orbs/red_tmp.png");
        this.load.image("water","./assets/orbs/blue_tmp.png");
        this.load.image("wood","./assets/orbs/green_tmp.png");
        this.load.image("dark","./assets/orbs/purp_tmp.png");
        this.load.image("light","./assets/orbs/yellow_tmp.png"); */
    }

    create(){

        this.cameras.main.setBackgroundColor("#5F9EA0");
        let health_bar = new HealthBar(this);
        this.add.image(300,350,"board_background");
        
        this.board = new Board(this,100,100);
    }

    update(time,delta){
        for(var i=0;i<this.board.length;i++){
            this.board.list[i].update();
        }
    }


}
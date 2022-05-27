var emitter = new Phaser.Events.EventEmitter();

class match_screen extends Phaser.Scene{

    constructor(sprite){
        super("match_screen");

    }

    preload(){

        this.load.image("board_background","./assets/board_background.png");
        this.load.image("fire","./assets/orbs/fire.png");
        this.load.image("water","./assets/orbs/water.png");
        this.load.image("wood","./assets/orbs/wood.png");
        this.load.image("dark","./assets/orbs/dark.png");
        this.load.image("light","./assets/orbs/light.png"); 
    }

    create(data){

        this.cameras.main.setBackgroundColor("#5F9EA0");
        this.enemy = new Enemy(this,350,200,data.enemy.texture);
        
        this.health_bar = new HealthBar(this,{x: 100,y: 100});
        this.add.image(300,350,"board_background");
        this.board = new Board(this,100,100);
        this.isPlayerTurn = true;
        emitter.on("solveComplete",this.updateEnemyHealth,this);
       
    }

    updateEnemyHealth(){

        this.health_bar.decrease(10);
        this.displayDamageText();
    }

    update(time,delta){

        for(var i=0;i<this.board.length;i++){
            this.board.list[i].update();
        }
    }


    displayDamageText(){

        let damageText = new Phaser.GameObjects.Text(this,350,200,"10");
        damageText.setColor("#FF0000");
        this.add.existing(damageText);
        this.tweens.add({
            targets: damageText,
            y: damageText.y-200,
            alpha: 0,
            duration: 2000,
            ease: "Quad.easeIn",
            onComplete: function(){
                damageText.destroy();
            }
        });
    }


}
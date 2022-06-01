var emitter = new Phaser.Events.EventEmitter();

class match_screen extends Phaser.Scene{

    constructor(sprite){
        super("match_screen");

    }

    preload(){

        this.load.image("board_background","./assets/board_background.png");
        this.load.image("combat_background","./assets/combat_background.png");
        this.load.image("fire","./assets/orbs/fire.png");
        this.load.image("water","./assets/orbs/water.png");
        this.load.image("wood","./assets/orbs/wood.png");
        this.load.image("dark","./assets/orbs/dark.png");
        this.load.image("light","./assets/orbs/light.png"); 
    }

    create(data){

       // this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor("#5F9EA0");
        //let img = new Phaser.GameObjects.Image(this,640/2,480/2,"combat_background");
        //img.setDisplaySize(640,480);
        //this.add.existing(img);

        this.comboCount = 0;
        this.data = data;

        this.enemy = new Enemy(this,330,130,data.enemy.texture);
        this.enemy.setScale(10,10);


        this.player_healthBar = new HealthBar(this,{x:200, y: 230},6*Orb.WIDTH);
        this.health_bar = new HealthBar(this,{x: this.game.config.width/2-50,y: 10},80);
        //this.add.image(300,350,"board_background");
        this.createHUD();
        
        this.board = new Board(this,100,100);
        this.isPlayerTurn = true;
        emitter.on("solveComplete",this.onSolveComplete,this);
        emitter.on("updateComboText",this.updateComboText,this);
       
    }

    createHUD(){

        this.totalCombosText = new Phaser.GameObjects.Text(this,10,10,"Combos: 0",{fontSize: "30px", color: "#FFBF00"});
        this.add.existing(this.totalCombosText);

    }
    
    onSolveComplete(){

       this.damageEnemy();
       this.comboCount = 0;

    }

    updateComboText(){

        this.comboCount++;
        this.totalCombosText.setText("Combos: " + this.comboCount);
    }

    damageEnemy(){

        this.health_bar.decrease(this.comboCount*5);
        this.displayDamageText();
        this.enemy.play("pink_hit");
        this.enemy.once("animationcomplete",()=>{
            this.enemy.play("pink_idle");
        });
        
    }

    update(time,delta){

        for(var i=0;i<this.board.length;i++){
            this.board.list[i].update();
        }
    }


    displayDamageText(){

        let damage = this.comboCount*5;
        let damageText= this.add.text(330,150,damage,{color: "#FF0000", fontSize: 50});

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
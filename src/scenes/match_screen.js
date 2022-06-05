

class match_screen extends Phaser.Scene{

    constructor(){
        super("match_screen");

        emitter.on("solveComplete",this.onSolveComplete,this);
        emitter.on("playerTurn",this.onPlayerTurn,this);
        emitter.on("comboMatched",this.onComboMatched,this);
        emitter.on("enemyDeath",this.onEnemyDeath,this); 

    }

    preload(){
        this.loadAssets();
    }

    create(data){

        this.cameras.main.fadeIn(1000);
        this.cameras.main.setBackgroundColor("#5F9EA0");
        this.comboCount = 0;
        this.data = data;

        this.enemy = new Enemy(this,330,130,data.enemy.texture).setScale(10,10);

        this.player_healthBar = new HealthBar(this,{x:200, y: 230},6*Orb.WIDTH);
        this.health_bar = new HealthBar(this,{x: this.game.config.width/2-50,y: 10},80);
        this.createHUD();
        this.board = new Board(this,100,100);

        this.colors = ["#FF0000","#0096FF","#50C878","#702963","#FFBF00"];

         //let img = new Phaser.GameObjects.Image(this,640/2,480/2,"combat_background");
        //img.setDisplaySize(640,480);
        //this.add.existing(img);
       
    }

    onEnemyDeath(){

        emitter.off("enemy_turn");
        emitter.off("damage_enemy");
        this.sound.play("slime_death");
        this.data.enemy.destroy();
    }

    createHUD(){

        this.totalCombosText = new Phaser.GameObjects.Text(this,10,10,"Combos: 0",{fontSize: "30px", color: "#FFBF00"});
        this.add.existing(this.totalCombosText);

    }
    
    onSolveComplete(){
       this.comboCount = 0;
       this.time.delayedCall(2000,()=>{
           emitter.emit("enemy_turn");
       },
       this);
    }

    onPlayerTurn(){
        this.board.tweenBoardAlpha(1);
        this.board.setInteractive();
    }

    onComboMatched(color,numOrbs){
        this.totalCombosText.setText("Combos: " + ++this.comboCount);
        const damage = numOrbs *2;
        this.displayDamageText(color,damage);
        this.damageEnemy(damage);
        this.enemy.play("pink_hit",true);
    }

    damageEnemy(damage){

        this.health_bar.decrease(damage);
        this.sound.play("slime_hit");
        this.enemy.chain("pink_idle");
    }

    update(time,delta){

        for(var i=0;i<this.board.length;i++){
            this.board.list[i].update();
        }
    }

    displayDamageText(color,damage){

        const posX = Phaser.Math.Between(250,350);
        const posY = Phaser.Math.Between(100,150);
        let damageText= this.add.text(posX,posY,damage,{color: this.colors[color], fontSize: 50});
        this.tweens.add({
            targets: damageText,
            x: damageText.x+ Phaser.Math.Between(-100,100),
            y: damageText.y - Phaser.Math.Between(200,100),
            alpha: 0,
            duration: 1000,
            ease: "Quad.easeIn",
            onComplete: function(){
                damageText.destroy();
            }
        });
    }


    loadAssets(){

        this.load.audio("player_hit","./assets/audio/sfx_player_hit.wav");
        this.load.audio("orbSwap","./assets/audio/orbSwap.wav");
        this.load.audio("orbCombo","./assets/audio/orbCombo.wav");
        this.load.audio("slime_hit","./assets/audio/sfx_slime_hit.wav");
        this.load.audio("slime_death","./assets/audio/sfx_slime_death.wav");
        this.load.image("fire","./assets/orbs/fire.png");
        this.load.image("water","./assets/orbs/water.png");
        this.load.image("wood","./assets/orbs/wood.png");
        this.load.image("dark","./assets/orbs/dark.png");
        this.load.image("light","./assets/orbs/light.png"); 

    }
}
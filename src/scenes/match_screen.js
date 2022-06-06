

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

        this.tweens.add({
            targets:  this.sound.get("main_music"),
            volume:   0,
            duration: 500,
            onComplete: ()=>{
                this.sound.stopByKey("main_music");
                this.sound.play("combat_music");

            }
        });

        this.enemy = new Enemy(this,330,130,data.enemy.texture,true).setScale(10,10);
        this.player_healthBar = new HealthBar(this,{x:200, y: 230},6*Orb.WIDTH);
        this.createHUD();
        this.board = new Board(this,100,100);

        this.colors = ["#FF0000","#0096FF","#50C878","#702963","#FFBF00"];

        this.particleArray = [];
        this.particleArray.push(this.add.particles("fire_particle"))
                          .push(this.add.particles("water_particle"))
                          .push(this.add.particles("wood_particle"))
                          .push(this.add.particles("dark_particle"))
                          .push(this.add.particles("light_particle"));


        //let img = new Phaser.GameObjects.Image(this,640/2,480/2,"combat_background");
        //img.setDisplaySize(640,480);
        //this.add.existing(img);
       
    }

    onEnemyDeath(){

        this.tweens.add({
            targets:  this.sound.get("combat_music"),
            volume:   0,
            duration: 1000,
            onComplete: ()=>{
                this.sound.stopByKey("combat_music");
                this.sound.play("main_music");

            }
        });

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
       this.time.delayedCall(2000,() => { emitter.emit("enemy_turn");},this);
    }

    onPlayerTurn(){
        this.board.tweenBoardAlpha(1);
        this.board.setInteractive();
    }

    onComboMatched(color,numOrbs,startPos){

        this.totalCombosText.setText("Combos: " + ++this.comboCount);
        const damage = numOrbs *2;
        this.playDamageAnimation(color,damage,startPos);
        emitter.emit("damage_enemy",damage);
    }

    playDamageAnimation(color,damage,startPos){
        const targetX = Phaser.Math.Between(250,350);
        const targetY = Phaser.Math.Between(100,130);
        this.emitParticles(startPos,targetX,targetY,color,damage);
    }

    displayDamageText(color,damage,posX,posY){
  
        let damageText= this.add.text(posX,posY,damage,{color: this.colors[color], fontSize: 50});
        this.tweens.add({
            targets: damageText,
            x: damageText.x + Phaser.Math.Between(-100,100),
            y: damageText.y - Phaser.Math.Between(200,100),
            alpha: 0,
            duration: 1000,
            ease: "Quad.easeIn",
            onComplete: function(){
                damageText.destroy();
            }
        });
    }


    emitParticles(startPos,targetX,targetY,color,damage){

        const particleEmitter = this.particleArray[color].createEmitter({
            x: startPos.x,
            y: startPos.y,
            quantity: 5,
            speed: {random: [50,100]},
            lifespan: {random: [200,400]},
            scale: { random: true, start: 1, end: 0 },
            blendMode: "NORMAL"
        });
        const midX = Phaser.Math.Between(targetX/2,targetX + targetX/2);
        const midY = Phaser.Math.Between(startPos.y,targetY);
        const xVals = [startPos.x,midX,targetX];
		const yVals = [startPos.y,midY,targetY];

        this.tweens.addCounter({
            from:0,
            to:1,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1000,
            onUpdate: tween => {

                const v = tween.getValue();
                const x = Phaser.Math.Interpolation.CatmullRom(xVals,v);
                const y = Phaser.Math.Interpolation.CatmullRom(yVals,v);
                particleEmitter.setPosition(x,y);
            },
            onComplete: () =>{
                particleEmitter.explode(50,targetX,targetY);
                particleEmitter.stop();
                this.displayDamageText(color,damage,targetX,targetY);
                this.time.delayedCall(1000, () => {
                    this.particles.removeEmitter(particleEmitter);
				});
               
            }
        });
    }


    loadAssets(){

        this.load.audio("player_hit","./assets/audio/sfx_player_hit.wav");
        this.load.audio("orbSwap","./assets/audio/orbSwap.wav");
        this.load.audio("orbCombo","./assets/audio/orbCombo.wav");
        this.load.audio("slime_hit","./assets/audio/sfx_slime_hit.wav");
        this.load.audio("slime_death","./assets/audio/sfx_slime_death.wav");
        this.load.image("fire","./assets/orbs/Fire.png");
        this.load.image("water","./assets/orbs/Water.png");
        this.load.image("wood","./assets/orbs/Wood.png");
        this.load.image("dark","./assets/orbs/Dark.png");
        this.load.image("light","./assets/orbs/Light.png"); 
        this.load.image("fire_particle","./assets/particles/fire_particle.png"); 
        this.load.image("wood_particle","./assets/particles/wood_particle.png"); 
        this.load.image("water_particle","./assets/particles/water_particle.png"); 
        this.load.image("dark_particle","./assets/particles/dark_particle.png"); 
        this.load.image("light_particle","./assets/particles/light_particle.png"); 

    }
}
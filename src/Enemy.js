class Enemy extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,texture,showHealth=false,slimeColor=-1,maxHealth){
        super(scene,x,y,texture); 

        this.color = (slimeColor == -1) ? Phaser.Math.Between(0,6) : slimeColor;
        this.scene.add.existing(this)
            .scene.physics.add.existing(this)
            .setImmovable(true)
            .play(slimeColors[this.color] + "_idle");

        if(showHealth){
            this.healthBar = new HealthBar(scene,{x: game.config.width/2-50 ,y: 10},80,maxHealth);
            emitter.on("enemy_turn",this.onEnemyTurn,this);
            emitter.on("damage_enemy",this.onDamaged,this);
        }
    }

    onEnemyTurn(){

        if(this.healthBar.value == 0){
            this.play(slimeColors[this.color] + "_death");
            this.x+= 50;
            this.y-= 50;
            this.on("animationcomplete",()=>{
                this.destroy();
                slimes_killed++;
                emitter.emit("enemy_death");
                
            });
            return;        
        }

        this.play(slimeColors[this.color] + "_swallow").chain(slimeColors[this.color] + "_idle");
        this.scene.sound.play("player_hit");
        emitter.emit("damage_player",Phaser.Math.Between(8,16));
        emitter.emit("playerTurn");

    }

    onDamaged(damage){
        this.scene.sound.play("slime_hit");
        this.play(slimeColors[this.color] + "_hit",true);
        this.healthBar.decrease(damage);

    }
    
}
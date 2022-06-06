class Enemy extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,texture,showHealth=false){
        super(scene,x,y,texture); 

        this.scene.add.existing(this)
            .scene.physics.add.existing(this)
            .setImmovable(true)
            .play("pink_idle");

        if(showHealth){
            this.healthBar = new HealthBar(scene,{x: game.config.width/2-50,y: 10},80);
            emitter.on("enemy_turn",this.attackPlayer,this);
            emitter.on("damage_enemy",this.onDamaged,this);
        }
    }

    attackPlayer(){

        this.play("pink_swallow").chain("pink_idle");
        this.scene.sound.play("player_hit");
        emitter.emit("damage_player",10);
        emitter.emit("playerTurn");

    }

    onDamaged(damage){
        this.scene.sound.play("slime_hit");
        this.play("pink_hit",true).chain("pink_idle");
        this.healthBar.decrease(damage);

    }
    
}
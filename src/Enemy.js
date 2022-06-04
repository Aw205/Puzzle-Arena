class Enemy extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,texture){
        super(scene,x,y,texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.play("pink_idle");
        this.setImmovable(true);
        emitter.on("enemy_turn",this.attackPlayer,this);
        emitter.on("damage_enemy",this.onDamaged,this);
    }

    attackPlayer(){

        this.play("pink_swallow");
        this.chain("pink_idle");
        this.scene.sound.play("player_hit");
        emitter.emit("playerTurn");

    }

    onDamaged(){

        this.scene.sound.play("slime_hit");
        this.play("pink_hit");
        this.once("animationcomplete",()=>{
            this.enemy.play("pink_idle");
        });

    }
    
}
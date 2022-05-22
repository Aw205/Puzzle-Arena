class Enemy extends Phaser.Physics.Arcade.Sprite{

    constructor(scene,x,y,texture){
        super(scene,x,y,texture);

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setImmovable(true);

    }
}
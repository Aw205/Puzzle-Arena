class Player extends Phaser.Physics.Arcade.Sprite{


    constructor(scene,x,y,texture){
        super(scene,x,y,texture);
       
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setSize(10,10);
        this.cursors = this.scene.input.keyboard.createCursorKeys();
        this.VELOCITY = 100;

        this.addToUpdateList();

    }

    preUpdate(delta,time){

        if(this.cursors.left.isDown) {
            this.body.setVelocity(-this.VELOCITY, 0);
        } else if(this.cursors.right.isDown) {
            this.body.setVelocity(this.VELOCITY, 0);
        } else if(this.cursors.up.isDown) {
            this.body.setVelocity(0, -this.VELOCITY);
        } else if(this.cursors.down.isDown) {
            this.body.setVelocity(0, this.VELOCITY);
        } else if (!this.cursors.right.isDown && !this.cursors.left.isDown && !this.cursors.up.isDown && !this.cursors.down.isDown) {
            this.body.setVelocity(0, 0);
        }

    }

}
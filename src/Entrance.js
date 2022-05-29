class Entrance extends Phaser.Physics.Arcade.Image{

    constructor(scene,x,y,texture){
        super(scene,x,y,texture);

        this.setVisible(false);
        this.scene.physics.add.existing(this);
        this.setImmovable(true);
        this.scene.physics.add.collider(this,player,this.onCollision,null,this);

    }

    onCollision(entrance,player){

        //console.log("going to " + this.data.get("destination"));
        let sceneName = this.data.get("destination");
        this.scene.scene.start(sceneName);

       
    }

}
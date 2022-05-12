
class Orb extends Phaser.Physics.Arcade.Sprite{

    static HEIGHT = 32;
    static WIDTH = 32;
    


    constructor(scene,x,y,row,col,texture){
        super(scene,x,y,texture);

        this.setOrigin(0,0);

        this.setScale(Orb.WIDTH/this.width,Orb.HEIGHT/this.height);

        this.type=1;
        this.row = row;
        this.col=col;
        this.startingX=0;
        this.startingY=0;
        this.isMatched = false;

        this.targetPos = new Phaser.Math.Vector2(0,0);

        this.scene.physics.add.existing(this);
        this.setCollideWorldBounds(true,0,0);
        this.scene.add.existing(this);
    }

    update(){

        let dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetPos.x, this.targetPos.y);
        if(this.body.speed>0){
            if(dist<5){
                this.body.reset(this.targetPos.x,this.targetPos.y);
            }
        }

    }

    setToStartPosition(){
        this.setPosition(this.startingX,this.startingY);

    }

}
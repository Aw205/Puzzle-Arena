
class Orb extends Phaser.Physics.Arcade.Sprite{

    static HEIGHT = 32;
    static WIDTH = 32;
    
    constructor(scene,x,y,row,col,texture){
        super(scene,x,y,texture);

        this.setOrigin(0,0);
        this.setScale(Orb.WIDTH/this.width,Orb.HEIGHT/this.height);

        this.type=1;
        this.row = row;
        this.col= col;  
        this.isVisited = false;
        this.targetPos = new Phaser.Math.Vector2(0,0); // in world units not rows/cols
        this.startPos = new Phaser.Math.Vector2(x,y);

        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);

    }

    update(){

        let dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetPos.x, this.targetPos.y);
        if(this.body.speed>0){
            if(dist<2){
                this.body.reset(this.targetPos.x,this.targetPos.y);
            }
        }
    }

    setToStartPosition(){
        this.setPosition(this.startPos.x,this.startPos.y); 
    }

}
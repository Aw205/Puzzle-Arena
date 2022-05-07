
class Orb extends Phaser.GameObjects.Sprite{

    static LENGTH = 25;
    static WIDTH = 25;


    constructor(scene,x,y,texture){
        super(scene,x,y,texture);

        this.setInteractive({draggable: true});
       
        this.setScale(Orb.LENGTH/this.width,Orb.LENGTH/this.height);
        this.on("drag",this.onDrag);
        this.scene.add.existing(this);


    }
    onDrag(pointer,dragX,dragY){

        this.setX(dragX);
        this.setY(dragY);

    }

}
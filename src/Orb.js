
class Orb extends Phaser.Physics.Arcade.Sprite{

    static LENGTH = 32;
    static WIDTH = 32;


    constructor(scene,x,y,row,col,texture){
        super(scene,x,y,texture);

        this.setOrigin(0,0);

        //this.setInteractive({draggable: true});

        //this.scene.physics.add.existing(this);

        //this.setSize(25,25);

        this.setScale(Orb.LENGTH/this.width,Orb.LENGTH/this.height);

        //this.on("drag",this.onDrag);
        //this.on("pointerdown",this.onPointerDown);
        //this.on("pointerup",this.onPointerUp);

        this.orbType=1;
        this.row = row;
        this.col=col;
        this.startingX=0;
        this.startingY=0;

        this.scene.add.existing(this);

    }

    onDrag(pointer,dragX,dragY){

        this.setX(dragX);
        this.setY(dragY);



    }

    onPointerUp(pointer,localX,localY,event){

        this.updatePosition(this.row,this.col);


    }

    onPointerDown(pointer,localX,localY,event){
       // Board.currentOrb=this;

        let x = Math.abs(localX/100)-0.5;
        let y = Math.abs(localY/100);
        console.log("X: " + x + "y: " + y);

        //this.setOrigin(x,0.5);
    }

    updatePosition(row,col){

        this.setX(100+col*25);
        this.setY(100+row*25);

    }

    setToStartPosition(){

        this.setPosition(this.startingX,this.startingY);

    }



}
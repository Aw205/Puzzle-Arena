

class Board extends Phaser.GameObjects.Container{

    constructor(scene,x,y){
        super(scene,x,y);

        this.orbImages = ["fire","water","wood","dark","light"];

        this.board_height = 5;
        this.board_width = 6;
        this.currentOrb = null;
        this.orbArray = null;
        this.startX=0;
        this.startY=0;


        this.on("pointerdown",this.onPointerDown);
        this.on("pointerup",this.onPointerUp);
        this.on("drag",this.onDrag);
        this.on("dragend",this.onDragEnd);

        this.setPosition(200,300);
        this.setSize(6*32,5*32);
     

        this.generateBoard();
       
        this.scene.physics.add.existing(this);

        this.setInteractive({draggable: true});
        this.scene.add.existing(this);
        

    }

    onPointerDown(pointer,localX,localY,event){

        let row = parseInt((pointer.y-220)/32);
        let col = parseInt((pointer.x-100)/32);
        
        this.currentOrb = this.orbArray[row][col];

        this.startX= this.currentOrb.x;
        this.startY= this.currentOrb.y;

    }

    onDrag(pointer,dragX,dragY){

        let row = parseInt((pointer.y-220)/32);
        let col = parseInt((pointer.x-100)/32);

        let deltaX = 200-dragX;
        let deltaY = 300-dragY;

        if(this.startX-deltaX >= -this.width/2 && (this.startX-deltaX <= -this.width/2 + 5*32)){
            this.currentOrb.setX(this.startX-deltaX);
        }

        if(this.startY-deltaY >= -this.height/2 && (this.startY-deltaY <= -this.height/2 + 4*32)){
            this.currentOrb.setY(this.startY-deltaY);
           
        }

        let current = this.orbArray[row][col]; 
        if(current != this.currentOrb){

            [this.currentOrb.startingX,current.startingX] = [current.startingX,this.currentOrb.startingX];
            [this.currentOrb.startingY,current.startingY] = [current.startingY,this.currentOrb.startingY];

           current.x=current.startingX;
           current.y=current.startingY;
           
            //update row and column

            [this.currentOrb.row,current.row] = [current.row,this.currentOrb.row];
            [this.currentOrb.col,current.col] = [current.col,this.currentOrb.col];

            [this.orbArray[row][col], this.orbArray[current.row][current.col]] = [this.orbArray[current.row][current.col],this.orbArray[row][col]];
         
        }

       
       
    }

    onDragEnd(pointer,dragX,dragY){

        this.currentOrb.setToStartPosition();
    }

    onPointerUp(pointer,localX,localY,event){

        this.currentOrb.setToStartPosition();

    }



    generateBoard(){

       let rand = Phaser.Math.Between(0,4);

       this.orbArray = new Array(this.board_height);
        for(var i =0; i<this.board_height;i++){
            this.orbArray[i]= new Array(this.board_width);
        }
        for(var row = 0; row < this.board_height;row++){
            for(var col =0; col < this.board_width;col++){
                rand = Phaser.Math.Between(0,4);
                this.orbArray[row][col] = new Orb(this.scene,-this.width/2+col*32,-this.height/2+row*32,row,col,this.orbImages[rand]);
                this.orbArray[row][col].startingX=-this.width/2+col*32;
                this.orbArray[row][col].startingY=-this.height/2+row*32;
                this.add(this.orbArray[row][col]);
               
            }
        }

    }

}


class Board extends Phaser.GameObjects.Container{

    constructor(scene,x,y){
        super(scene,x,y);

        this.orbImages = ["fire","water","wood","dark","light"];

        this.BOARD_HEIGHT = 5;
        this.BOARD_WIDTH = 6;
        this.currentOrb = null;
        this.orbArray = null;
        this.startX=0;
        this.startY=0;

        this.on("pointerdown",this.onPointerDown);
        this.on("pointerup",this.onPointerUp);
        this.on("drag",this.onDrag);
        this.on("dragend",this.onDragEnd);

        this.setPosition(200,300);
        this.setSize(this.BOARD_WIDTH*Orb.WIDTH,this.BOARD_HEIGHT*Orb.HEIGHT);
     

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
        this.solveBoard();

        this.skyfall();
    }



    generateBoard(){

       let rand = Phaser.Math.Between(0,4);

       this.orbArray = new Array(this.BOARD_HEIGHT);
        for(var i =0; i<this.BOARD_HEIGHT;i++){
            this.orbArray[i]= new Array(this.BOARD_WIDTH);
        }
        for(var row = 0; row < this.BOARD_HEIGHT;row++){
            for(var col =0; col < this.BOARD_WIDTH;col++){
                rand = Phaser.Math.Between(0,4);
                this.orbArray[row][col] = new Orb(this.scene,-this.width/2+col*32,-this.height/2+row*32,row,col,this.orbImages[rand]);
                this.orbArray[row][col].startingX=-this.width/2+col*32;
                this.orbArray[row][col].startingY=-this.height/2+row*32;
                this.orbArray[row][col].type = rand;
                this.add(this.orbArray[row][col]);
               
            }
        }
    }


    solveBoard(){

        for(var i = 0; i < this.BOARD_HEIGHT;i++){
            for(var  j = 0; j < this.BOARD_WIDTH;j++){
                if(!this.orbArray[i][j].isMatched){
                    this.findMatches(this.orbArray[i][j],i,j);
                }
            }
        }

        for(var i = 0; i < this.BOARD_HEIGHT;i++){
            for(var  j = 0; j < this.BOARD_WIDTH;j++){
                if(this.orbArray[i][j].isMatched){
                    this.orbArray[i][j].destroy();
                    this.orbArray[i][j]=null;
                }
            }
        }

    }

    findMatches(current,row,col){

        var columns = [];
        var rows = [];
        var pos = [2,1,-1,-2];

        var colCounter =0;
        var rowCounter =0;

        for(var n = 0; n < 3; n++){
            for(var i = n ; i< n +2; i++){
                if(row + pos[i] < this.BOARD_HEIGHT && row + pos[i] > -1 ){
                    if(this.orbArray[row + pos[i]][col].type == current.type){
                        colCounter++;
                        columns.push(this.orbArray[row + pos[i]][col]);
                    }
                }

                if(col + pos[i] < this.BOARD_WIDTH && col + pos[i] > -1 ){
                    if(this.orbArray[row][col + pos[i]].type == current.type){
                        rowCounter++;
                        rows.push(this.orbArray[row][col + pos[i]]);
                    }
                }
            }

            if(colCounter == 2){
                current.isMatched=true;
                for(var orb of columns){
                    orb.isMatched=true;
                }
            }
            if(rowCounter ==2){
                current.isMatched =true;
                for(var orb of rows){
                    orb.isMatched=true;
                }
            }

            columns = [];
            rows = [];
            colCounter=0;
            rowCounter=0;

        }

    }

    skyfall(){

        this.calcFallDistance();
    }

    calcFallDistance(){

        let dropDist =0;
        for(var col = 0; col < this.BOARD_WIDTH; col++){
            for(var  row = this.BOARD_HEIGHT-1; row > -1;row--){
                let current = this.orbArray[row][col];
                if(current==null){
                   dropDist++;
                }
                else{
                   current.targetPos.set(current.x,-this.height/2+(row+dropDist)*32);
                   this.scene.physics.moveToObject(current,current.targetPos,60);
                   [this.orbArray[row][col],this.orbArray[row+dropDist][col]] =  [this.orbArray[row+dropDist][col],this.orbArray[row][col]];
                }
            }
            dropDist =0;
        }

    }

    isInBounds(row,col){
        return (row > -1 && row < this.BOARD_HEIGHT && col > -1 && col < this.BOARD_WIDTH);
    }

}
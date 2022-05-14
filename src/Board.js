
class Board extends Phaser.GameObjects.Container{

    constructor(scene,x,y){
        super(scene,x,y);

        this.orbImages = ["fire","water","wood","dark","light"];

        this.BOARD_HEIGHT = 5;
        this.BOARD_WIDTH = 6;
        this.cursorOrb = null;
        this.orbArray = null;
        this.skyfallArray = null;

        this.startX=0;
        this.startY=0;
        this.comboList = [];

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
        
        this.cursorOrb = this.orbArray[row][col];

        this.startX= this.cursorOrb.x;
        this.startY= this.cursorOrb.y;

    }

    onDrag(pointer,dragX,dragY){

        let row = parseInt((pointer.y-220)/32);
        let col = parseInt((pointer.x-100)/32);

        let deltaX = 200-dragX;
        let deltaY = 300-dragY;

        if(this.startX-deltaX >= -this.width/2 && (this.startX-deltaX <= -this.width/2 + 5*32)){
            this.cursorOrb.setX(this.startX-deltaX);
        }

        if(this.startY-deltaY >= -this.height/2 && (this.startY-deltaY <= -this.height/2 + 4*32)){
            this.cursorOrb.setY(this.startY-deltaY);
        }

        let current = this.orbArray[row][col]; 
        if(current != this.cursorOrb){

            [this.cursorOrb.startPos, current.startPos] = [current.startPos,this.cursorOrb.startPos]; 
            current.setPosition(current.startPos.x,current.startPos.y); 
        
            //update row and column

            [this.cursorOrb.row,current.row] = [current.row,this.cursorOrb.row];
            [this.cursorOrb.col,current.col] = [current.col,this.cursorOrb.col];

            [this.orbArray[row][col], this.orbArray[current.row][current.col]] = [this.orbArray[current.row][current.col],this.orbArray[row][col]];
         
        }
    }

    onDragEnd(pointer,dragX,dragY){

        this.cursorOrb.setToStartPosition();
    }

    onPointerUp(pointer,localX,localY,event){

        this.cursorOrb.setToStartPosition();
        this.solveBoard();
        //this.skyfall();
    }

    generateBoard(){

       let rand = Phaser.Math.Between(0,4);
       this.orbArray = new Array(this.BOARD_HEIGHT);
       this.skyfallArray = new Array(this.BOARD_HEIGHT);
        for(var i =0; i<this.BOARD_HEIGHT;i++){
            this.orbArray[i]= new Array(this.BOARD_WIDTH);
            this.skyfallArray[i]= new Array(this.BOARD_WIDTH);
        }

        for(var row = 0; row < this.BOARD_HEIGHT;row++){
            for(var col =0; col < this.BOARD_WIDTH;col++){
                rand = Phaser.Math.Between(0,4);
                let x = -this.width/2+col*Orb.WIDTH;
                let y = -this.height/2+row*Orb.HEIGHT;

                this.orbArray[row][col] = new Orb(this.scene,x,y,row,col,this.orbImages[rand]);
                this.orbArray[row][col].type = rand;

                this.skyfallArray[row][col] = new Orb(this.scene,x,y-5*Orb.HEIGHT,row,col,this.orbImages[rand]);
                this.skyfallArray[row][col].type = rand;
                this.skyfallArray[row][col].setVisible(false);

                this.add(this.orbArray[row][col]);

                this.add(this.skyfallArray[row][col]);
               
            }
        }
    }

    solveBoard(){

        this.matchBoard();
        console.log("Number combos: " + this.comboList.length);

        /* for(var i = 0; i < this.BOARD_HEIGHT;i++){
            for(var  j = 0; j < this.BOARD_WIDTH;j++){
                if(this.orbArray[i][j].isMatched){
                    this.orbArray[i][j].destroy();
                    this.orbArray[i][j]=null;
                }
            }
        } */

    }

    matchBoard(){

        let connectedOrbs = [];

        for(var row = 0; row < this.BOARD_HEIGHT;row++){
            for(var  col = 0; col < this.BOARD_WIDTH;col++){
                let set = new Set();
                let current = this.orbArray[row][col];          
                if(!current.isVisited){
                    current.isVisited=true;
                    this.floodfill(row,col,current.type,set);
                }
                if(set.size>2){
                    connectedOrbs.push(set);
                }
            }
        }

        for(let set of connectedOrbs){
           /*  arr.sort(this.compareRows); // checking horizontal matches
            let rowList = []; 
            for(var i =0 ; i< arr.length-1; i++){
                if(arr[i].row == arr[i+1].row){
                    rowList.push(arr[i]);
                }
                else{
                    rowList = [];
                }
            }
            arr.sort(this.compareCols);
            let colList = [];
            for(var i =0 ; i< arr.length -1; i++){
                if(!rowList.includes(arr[i]) && arr[i].col==arr[i+1].col){
                    colList.push(arr[i]);
                }
                else{
                    colList = [];
                }
            } */
                this.comboList.push(set);
        }
    }

    compareRows(orb1,orb2){
        return orb1.row - orb2.row;
    }
    compareCols(orb1,orb2){
        return orb1.col - orb2.col;
    }

    floodfill(row,col,type,matchedList){

        let numHorizontal =0;
        let numVertical = 0;
        let adj_arr =[];

        for(var i = 0;i<4;i++){
            let x=(i-1)%2;    // -1 0 1 0
			let y= (3-i-1)%2; // 0 1 0 -1
            if(this.isInBounds(row+x,col+y)) {
                let adj = this.orbArray[row + x][col + y];
                if(adj.type == type){
                    (x==0) ? numHorizontal++ : numVertical++;
                    if(!adj.isVisited){
                        adj_arr.push(adj);
                    }
                }
              }
        }

        for(let orb of adj_arr){
            orb.isVisited=true;
            this.floodfill(orb.row,orb.col,type,matchedList);
        }
        if(numHorizontal==2){
            matchedList.add(this.orbArray[row][col]);
            matchedList.add(this.orbArray[row][col-1]);
            matchedList.add(this.orbArray[row][col+1]);
        }
        if(numVertical==2){
            matchedList.add(this.orbArray[row][col]);
            matchedList.add(this.orbArray[row-1][col]);
            matchedList.add(this.orbArray[row+1][col]);
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
                   current.targetPos.set(current.x,-this.height/2+(row+dropDist)*Orb.HEIGHT);
                   this.scene.physics.moveToObject(current,current.targetPos,60,500);
                   [this.orbArray[row][col],this.orbArray[row+dropDist][col]] =  [this.orbArray[row+dropDist][col],this.orbArray[row][col]];
                }
            }
             // need to skyfall new orbs 
             for(var r = this.BOARD_HEIGHT-1;r > this.BOARD_HEIGHT-dropDist-1 ;r--){
                let current = this.skyfallArray[r][col];
                current.setVisible(true);
                current.targetPos.set(current.x,-this.height/2+(r-this.BOARD_HEIGHT+dropDist)*Orb.HEIGHT);
                this.scene.physics.moveToObject(current,current.targetPos,60,500);
                
            } 
            dropDist =0;
        }

    }

    isInBounds(row,col){
        return (row > -1 && row < this.BOARD_HEIGHT && col > -1 && col < this.BOARD_WIDTH);
    }

}
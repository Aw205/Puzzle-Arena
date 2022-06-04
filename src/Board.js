
class Board extends Phaser.GameObjects.Container {

    constructor(scene, x, y) {
        super(scene, x, y);
        this.orbImages = ["fire", "water", "wood", "dark", "light"];

        this.BOARD_HEIGHT = 5;
        this.BOARD_WIDTH = 6;
        this.cursorOrb = null;
        this.orbArray = new Array(this.BOARD_HEIGHT);
        this.skyfallArray = new Array(this.BOARD_HEIGHT);

        this.startX = 0;
        this.startY = 0;
        this.comboList = [];
        this.comboCount = 0;

        this.on("pointerdown", this.onPointerDown)
            .on("pointerup", this.onPointerUp)
            .on("drag", this.onDrag)
            .on("dragend", this.onDragEnd)
            .setPosition(300,350)
            .setSize(this.BOARD_WIDTH * Orb.WIDTH, this.BOARD_HEIGHT * Orb.HEIGHT)
            .generateBoard();

        this.setInteractive({ draggable: true });

        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);


    }

    getPointerArrayPos(pointer,updateRow){

        //console.log("pointer y =" + pointer.y);
        //console.log("pointer x =" + pointer.x);
        //let vec = new Phaser.Math.Vector2(0,0);
        //this.getLocalPoint(pointer.x,pointer.y,vec);
        //console.log("local point: " + vec.x + "," + vec.y);
        //let col = 2 + vec.x/32;
        //console.log("col: " + Math.round(col));

        if(updateRow){
            return parseInt((pointer.y - 275)/ Orb.WIDTH);
        }
        return parseInt((pointer.x - 204) / Orb.HEIGHT);
    }

    onPointerDown(pointer, localX, localY, event) {

        let row = this.getPointerArrayPos(pointer,true);
        let col = this.getPointerArrayPos(pointer,false);

        this.cursorOrb = this.orbArray[row][col];
        this.cursorOrb.setPointerDownDisplayState();
        this.startX = this.cursorOrb.x;
        this.startY = this.cursorOrb.y;

        this.cursorOrb.setOrigin(-(localX-Orb.WIDTH/2-Orb.WIDTH*col)/Orb.WIDTH,-(localY-Orb.HEIGHT/2-Orb.HEIGHT*row)/Orb.HEIGHT);
        
    }

    onDrag(pointer, dragX, dragY) {

        let row = this.getPointerArrayPos(pointer,true);
        let col = this.getPointerArrayPos(pointer,false);

        let deltaX = this.x - dragX;
        let deltaY = this.y - dragY;

        if (this.startX - deltaX >= -this.displayWidth / 2 && (this.startX - deltaX <= -this.displayWidth / 2 + (this.BOARD_WIDTH - 1) * Orb.WIDTH)) {
            this.cursorOrb.setX(this.startX - deltaX);
        }
        if (this.startY - deltaY >= -this.displayHeight / 2 && (this.startY - deltaY <= -this.displayHeight / 2 + (this.BOARD_HEIGHT - 1) * Orb.HEIGHT)) {
            this.cursorOrb.setY(this.startY - deltaY);
        }

        let current = this.orbArray[row][col];
        if (current != this.cursorOrb) {

            this.scene.sound.play("orbSwap",{volume: 0.1});

            [this.cursorOrb.startPos, current.startPos] = [current.startPos, this.cursorOrb.startPos];
            current.setPosition(current.startPos.x, current.startPos.y);

            //update row and column
            [this.cursorOrb.row, current.row] = [current.row, this.cursorOrb.row];
            [this.cursorOrb.col, current.col] = [current.col, this.cursorOrb.col];

            [this.orbArray[row][col], this.orbArray[current.row][current.col]] = [this.orbArray[current.row][current.col], this.orbArray[row][col]];

        }
    }

    onDragEnd(pointer, dragX, dragY) {
        this.cursorOrb.setToStartPosition();
    }

    onPointerUp(pointer, localX, localY, event) {

        this.disableInteractive();
        this.cursorOrb.setToStartPosition();
        this.cursorOrb.resetDisplayState();
        this.solveBoard();

    }

    generateBoard() {

        let rand = -1;

        for (var i = 0; i < this.BOARD_HEIGHT; i++) {
            this.orbArray[i] = new Array(this.BOARD_WIDTH);
            this.skyfallArray[i] = new Array(this.BOARD_WIDTH);
        }

        for (var row = 0; row < this.BOARD_HEIGHT; row++) {
            for (var col = 0; col < this.BOARD_WIDTH; col++) {
                rand = Phaser.Math.Between(0, 4);
                let x = -this.width / 2 + col * Orb.WIDTH;
                let y = -this.height / 2 + row * Orb.HEIGHT;

                this.orbArray[row][col] = new Orb(this.scene, x, y, row, col, this.orbImages[rand]);
                this.orbArray[row][col].type = rand;

                rand = Phaser.Math.Between(0, 4);
                this.skyfallArray[row][col] = new Orb(this.scene, x, y - this.BOARD_HEIGHT * Orb.HEIGHT, row, col, this.orbImages[rand]);
                this.skyfallArray[row][col].type = rand;
                this.skyfallArray[row][col].setVisible(false);

                this.add(this.orbArray[row][col]);
                this.add(this.skyfallArray[row][col]);

            }
        }
    }

    solveBoard() {

        this.resetBoardState();
        let numCombos = this.findCombos();
        if(numCombos>0){
            this.fadeCombos();
            return;

        }
        this.tweenBoardAlpha(0.6);
        emitter.emit("solveComplete");
        //this.setInteractive();
    }

    resetBoardState() {

        for (var row = 0; row < this.BOARD_HEIGHT; row++) {
            for (var col = 0; col < this.BOARD_WIDTH; col++) {
                let x = -this.width / 2 + col * Orb.WIDTH;
                let y = -this.height / 2 + row * Orb.HEIGHT;

                this.orbArray[row][col].isVisited = false;

                if (this.skyfallArray[row][col] == null) {
                    let rand = Phaser.Math.Between(0, 4);
                    this.skyfallArray[row][col] = new Orb(this.scene, x, y - 5 * Orb.HEIGHT, row, col, this.orbImages[rand]);
                    this.skyfallArray[row][col].type = rand;
                    this.skyfallArray[row][col].setVisible(false);
                    this.add(this.skyfallArray[row][col]);
                }
            }
        }
    }

    fadeCombos() {

        var timer = this.scene.time.addEvent({
            delay: 500,
            callback: this.onEvent,
            callbackScope: this,
            repeat: this.comboList.length
        });

    }

    onEvent() {

        if(this.comboList.length==0){
            return this.skyfall();
        }
        this.scene.sound.play("orbCombo");
        let set = this.comboList.pop();
        this.scene.tweens.add({
            targets: set,
            alpha: { from: 1, to: 0 },
            ease: 'Sine.InOut',
            duration: 450,
            onCompleteScope: this,
            onComplete: function () {
                emitter.emit("updateComboText");
                for(let orb of set){
                    this.orbArray[orb.row][orb.col] = null;
                    orb.destroy();
                }
            }
        });
        
    }

    findCombos() {

        for (let arr of this.orbArray) {
            for (let curr of arr) {
                let comboSet = []; //changed from set to array
                if (!curr.isVisited) {
                    curr.isVisited = true;
                    this.floodfill(curr.row, curr.col, curr.type, comboSet);
                }
                if (comboSet.length > 2) {
                    this.comboList.push(comboSet);
                }
            }
        }
        return this.comboList.length;
    }

    floodfill(row, col, type, comboSet) {

        let adj_arr = [];
        let matches = [[], []];

        for (var i = 0; i < 4; i++) {
            let x = (i - 1) % 2;     // -1 0 1 0
            let y = (3 - i - 1) % 2; // 0 1 0 -1
            if (this.isInBounds(row + x, col + y)) {
                let adj = this.orbArray[row + x][col + y];
                if (adj.type == type) {
                    (x == 0) ? matches[0].push(adj) : matches[1].push(adj);
                    if (!adj.isVisited) {
                        adj_arr.push(adj);
                    }
                }
            }
        }
        for (let orb of adj_arr) {
            orb.isVisited = true;
            this.floodfill(orb.row, orb.col, type, comboSet);
        }
        for (let arr of matches) {
            if (arr.length == 2) {
                comboSet.push(this.orbArray[row][col]);
                for (let orb of arr) {
                    comboSet.push(orb);
                }
            }
        }
    }

    skyfall() {

        let dropDist = 0;
        for (var col = 0; col < this.BOARD_WIDTH; col++) {
            for (var row = this.BOARD_HEIGHT - 1; row > -1; row--) {
                let current = this.orbArray[row][col];
                if (current == null) {
                    dropDist++;
                }
                else {
                    current.targetPos.set(current.x, -this.height / 2 + (row + dropDist) * Orb.HEIGHT);
                    this.scene.physics.moveToObject(current, current.targetPos, 60, 500);
                    current.row += dropDist;
                    current.startPos.set(current.x, current.targetPos.y);
                    [current, this.orbArray[row + dropDist][col]] = [this.orbArray[row + dropDist][col], current];
                }
            }
            //skyfalling new orbs 
            for (var r = this.BOARD_HEIGHT - 1; r > this.BOARD_HEIGHT - dropDist - 1; r--) {

                let current = this.skyfallArray[r][col];
                let newRow = r - this.BOARD_HEIGHT + dropDist;
               
                current.setVisible(true);
                current.targetPos.set(current.x, -this.height / 2 + (newRow) * Orb.HEIGHT);

                current.row = newRow;
                current.startPos.set(current.x, current.targetPos.y);
                this.orbArray[newRow][col] = current;
                this.skyfallArray[r][col] = null;
                this.scene.physics.moveToObject(current, current.targetPos, 60, 500);

            }
            dropDist = 0;
        }
        this.solveBoard(); 
    }


    tweenBoardAlpha(alph){

        for(let arr of this.orbArray){    
                this.scene.tweens.add({
                    targets: arr,
                    alpha: alph,
                    duration: 1000,
                    ease: "Quad.easeIn",
                     });
            }
    }

    isInBounds(row, col) {
        return (row > -1 && row < this.BOARD_HEIGHT && col > -1 && col < this.BOARD_WIDTH);
    }

}
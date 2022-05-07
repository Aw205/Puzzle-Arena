class match_screen extends Phaser.Scene{

    static BOARD_WIDTH=6;
    static BOARD_HEIGHT=5;


    constructor(){
        super("match_screen");
    }


    preload(){

        this.load.image("fire","./assets/orbs/Fire.png");

    }

    create(){

        this.generateBoard();

    }

    generateBoard(){

        let rand = Phaser.Math.Between(0,5);
        let x = 100;
        //let y = 200;

        let board = new Array(match_screen.BOARD_HEIGHT);
        for(var i =0; i<board.length;i++){
            board[i]= new Array(match_screen.BOARD_WIDTH);
        }

        for(var row = 0; row < board.length;row++){
            for(var col =0; col < board[0].length;col++){
                board[row][col] = new Orb(this,x+col*25,100+row*25,"fire");
            }
        }

    }

}
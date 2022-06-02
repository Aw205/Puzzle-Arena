'use strict';

// global variables
let cursors;

let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    physics:{
        default: 'arcade',
        arcade: {
            //debug: true
        },
    },
    scene: [Menu,match_screen,shop_room,game_screen],
    pixelArt: true,
    //zoom : 1
}
let game = new Phaser.Game(config);
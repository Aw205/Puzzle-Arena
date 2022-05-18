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
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu,match_screen,game_screen],
    pixelArt: true,
    //zoom : 1
}
let game = new Phaser.Game(config);
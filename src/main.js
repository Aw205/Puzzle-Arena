
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [match_screen,game_screen],
    physics:{
        default:'arcade',
        arcade:{debug:true},
        //debug: true
    },
    //pixelArt: true,
    //zoom : 1
}
let game = new Phaser.Game(config);
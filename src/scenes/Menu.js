var emitter = new Phaser.Events.EventEmitter();
var backgroundMusic;
var music_isPlaying = false;

class Menu extends Phaser.Scene{

    constructor(){
        super("Menu");
    }

    preload(){

        this.load.audio("button_click","./assets/audio/button_click.wav");
        this.load.audio("combat_music","./assets/audio/puzzle_arena.mp3"); 
        this.load.audio("main_music","./assets/audio/happy_vibe.ogg"); 
        //this.load.image("menu_background","./assets/menu_background.png");
    }

    create(){

         if(!music_isPlaying){
            this.sound.play("main_music",{loop: true, volume: 0.6});
            this.sound.add("combat_music",{loop:true});
            music_isPlaying=true;
        }

        //let background =  this.add.image(game.config.width/2,game.config.height/2,"menu_background");
        //background.setScale(0.5,0.5);
        
        const startButton = new TextButton(this,game.config.width/2,250,"Start",{fontSize: 30},()=> this.scene.start("game_screen")).setOrigin(0.5);
        //const tutorialButton = new TextButton(this,game.config.width/2+25,350,"How To Play",{fontSize: 30},()=> this.scene.start("Tutorial")).setOrigin(0.5);
        
    }

}
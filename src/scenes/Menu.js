var emitter = new Phaser.Events.EventEmitter();
var music_isPlaying = false;

class Menu extends Phaser.Scene{

    constructor(){
        super("Menu");
    }

    preload(){

        this.load.audio("button_click","./assets/audio/button_click.wav");
        this.load.audio("combat_music","./assets/audio/puzzle_arena.mp3"); 
        this.load.audio("main_music","./assets/audio/happy_vibe.ogg"); 
        this.load.image("battle_background","./assets/battleback10.png"); 
        this.load.image("button_background","./assets/button_background.png"); 
        this.load.svg("puzzle_arena_background","./assets/puzzle_arena_menu.svg",{width: 640, height: 480});
    }

    create(){

         if(!music_isPlaying){
            this.sound.play("main_music",{loop: true, volume: 0.6});
            this.sound.add("combat_music",{loop:true});
            music_isPlaying=true;
        }
        this.add.image(game.config.width/2,game.config.height/2,"puzzle_arena_background");
        
        const startButton = new TextButton(this,game.config.width/2,500,"Start",{fontSize: 30},()=> this.scene.start("game_screen")).setOrigin(0.5);
        const creditsButton = new TextButton(this,game.config.width/2,600,"Credits",{fontSize: 22},()=> this.scene.start("game_screen")).setOrigin(0.5);
        const tutorialButton = new TextButton(this,game.config.width/2,550,"Tutorial",{fontSize: 22},()=> this.scene.start("game_screen")).setOrigin(0.5);

        this.tweens.add({
            targets: [startButton, startButton.img],
            y: 250,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1500
        });

        this.tweens.add({
            targets: [tutorialButton, tutorialButton.img],
            y: 320,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1500
        });

        this.tweens.add({
            targets: [creditsButton, creditsButton.img],
            y: 390,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1500
        });

        
        
    }

}
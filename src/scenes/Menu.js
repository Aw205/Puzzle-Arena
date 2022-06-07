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

        this.load.atlas("player_run","./assets/player/Alex_run_16x16.png","./assets/player/player_run.json");
        this.load.atlas("slime_idle1","./assets/enemy/slime_idle1.png","./assets/enemy/slime_idle1.json");
        this.load.atlas("slime_idle","./assets/enemy/slime_idle3.png","./assets/enemy/slime_idle.json");
        this.load.atlas("slime_hit","./assets/enemy/slime_hit.png","./assets/enemy/slime_hit.json");
        this.load.atlas("slime_death","./assets/enemy/slime_die.png","./assets/enemy/slime_death.json");
        this.load.atlas("slime_swallow","./assets/enemy/slime_swallow.png","./assets/enemy/slime_swallow.json");
    }

    create(){

        if(!music_isPlaying){
            this.sound.play("main_music",{loop: true, volume: 0.3});
            this.sound.add("combat_music",{loop:true});
            music_isPlaying=true;
        }
        this.createAnimations();
        this.add.image(game.config.width/2,game.config.height/2,"puzzle_arena_background");
        
        this.startButton = new TextButton(this,game.config.width/2,500,"Start",{fontSize: 30},()=> this.scene.start("game_screen")).setOrigin(0.5);
        this.tutorialButton = new TextButton(this,game.config.width/2,550,"Tutorial",{fontSize: 22},()=> this.scene.start("game_screen")).setOrigin(0.5);
        this.creditsButton = new TextButton(this,game.config.width/2,600,"Credits",{fontSize: 22},()=> this.scene.start("game_screen")).setOrigin(0.5);

        this.tweenButtons();
        this.spawnSlimes();
  
       
    }

    tweenButtons(){
        this.tweens.add({
            targets: [this.startButton, this.startButton.img],
            y: 250,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1500
        });

        this.tweens.add({
            targets: [this.tutorialButton, this.tutorialButton.img],
            y: 320,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1500
        });

        this.tweens.add({
            targets: [this.creditsButton, this.creditsButton.img],
            y: 390,
            ease: Phaser.Math.Easing.Sine.InOut,
            duration: 1500
        });
    }

    spawnSlimes(){

        this.time.addEvent({
            delay: 1500,
            callback: () => this.time.delayedCall(Phaser.Math.Between(1000,5000), this.spawnSlime,null,this),
            callbackScope: this,
            repeat: 5,
        });
    }

    spawnSlime(){

        let xArr = [Phaser.Math.Between(10,230),Phaser.Math.Between(400,600)];
        let randY = Phaser.Math.Between(200,450);
        let scaleFactor = Phaser.Math.FloatBetween(1,3);
        let enem = this.add.sprite(Phaser.Math.RND.pick(xArr),-50,"pink_idle").setScale(scaleFactor,scaleFactor).setInteractive({useHandCursor: true});
        enem.play("pink_idle");
        enem.on("pointerdown", function(pointer){
            enem.play("pink_death");
            enem.on("animationcomplete",enem.destroy);
            this.spawnSlime();
        },this);
        this.add.tween({
            targets: enem,
            y: randY,
            ease: "Expo.easeIn",
            duration: 2000
         });

    }

    displayCredits(){


    }


    createAnimations(){

        this.anims.create({
            key: "pink_idle",
            frames: this.anims.generateFrameNames("slime_idle1",{
                prefix: "pink_",
                start:0,
                end: 1
            }),
            frameRate: 3,
            repeat: -1
        });

        this.anims.create({
            key: "pink_hit",
            frames: this.anims.generateFrameNames("slime_hit",{
                prefix: "pink_",
                end: 1
            }),
            frameRate: 2,
            repeat: 0
        });

        this.anims.create({
            key: "pink_death",
            frames: this.anims.generateFrameNames("slime_death",{
                prefix: "pink_",
                end: 12
            }),
            frameRate: 12,
            repeat: 0
        });

        this.anims.create({
            key: "run_left",
            frames: this.anims.generateFrameNames("player_run",{
                prefix: "run_left_",
                start: 0,
                end:5
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "run_right",
            frames: this.anims.generateFrameNames("player_run",{
                prefix: "run_right_",
                start: 0,
                end:5
            }),
            frameRate:10,
            repeat: -1
        });
        this.anims.create({
            key: "run_up",
            frames: this.anims.generateFrameNames("player_run",{
                prefix: "run_up_",
                start: 0,
                end: 5
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "run_down",
            frames: this.anims.generateFrameNames("player_run",{
                prefix: "run_down_",
                start: 0,
                end:2
            }),
            frameRate:5,
            repeat: -1
        });

        this.anims.create({
            key: "pink_swallow",
            frames: this.anims.generateFrameNames("slime_swallow",{
                prefix: "pink_",
                start: 0,
                end:13
            }),
            frameRate:12,
            repeat: 0
        });
    }

}
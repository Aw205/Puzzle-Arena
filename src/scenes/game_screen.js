var controls;

class game_screen extends Phaser.Scene {


    constructor() {
        super("game_screen");
    }

    preload() {


        this.load.atlas("slime_idle","./assets/enemy/slime_idle3.png","./assets/enemy/slime_idle.json");
        this.load.image("overworld", "./assets/map/Overworld.png");
        this.load.image("slime", "./assets/slime.png");
        this.load.image("knight", "./assets/knight.png");
        this.load.tilemapTiledJSON("tilemap", "./assets/map/Map.json");

    }

    create() {

        this.anims.create({
            key: "pink_idle",
            frames: this.anims.generateFrameNames("slime_idle",{
                prefix: "pink_",
                end: 6
            }),
            frameRate: 10,
            repeat: -1
        });



        const map = this.make.tilemap({key: "tilemap" });
        const tileset = map.addTilesetImage("Overworld", "overworld");
        map.createLayer("Ground", tileset);
        let layer = map.createLayer("Shubbery", tileset);
        let enemyArray = map.createFromObjects("Enemy",{name: "Rock", key: "slime", classType: Enemy});
        layer.setCollisionByProperty({collides: true});

        this.player = new Player(this,50,0,"knight");
        let pink_slime = new Enemy(this,0,0,"pink_idle");
        pink_slime.play("pink_idle");

        this.physics.add.collider(this.player,layer);
        this.physics.add.collider(enemyArray[0],this.player,()=>{
            this.scene.start("match_screen",{enemy: /*enemyArray[0]*/pink_slime});
        });

        
        this.cameras.main.startFollow(this.player,false,0.2,0.2);
        this.cameras.main.setZoom(2);
        this.cameras.main.setBounds(0, 0, map.widthInPixels,map.heightInPixels);

        // this.player.body.setCollideWorldBounds(true);
        // this.player.body.onWorldBounds = true;   
 

    }

    createMap(){

        const map = this.make.tilemap({key: "tilemap" });
        const tileset = map.addTilesetImage("Overworld", "overworld");
        map.createLayer("Ground", tileset);
        let layer = map.createLayer("Shubbery", tileset);
        let enemyArray = map.createFromObjects("Enemy",{name: "Rock", key: "slime", classType: Enemy});
        layer.setCollisionByProperty({collides: true});


    }

    update() {
        this.player.update();
    }

}